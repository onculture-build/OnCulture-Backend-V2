/* eslint-disable @typescript-eslint/no-unused-vars */
import { CrudService } from '@@/common/database/crud.service';
import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import {
  BaseCompany,
  BaseUser,
  CompanyRequestStatus,
  Prisma,
  PrismaClient,
} from '@prisma/client';
import { BaseCompanyMaptype } from './base-company.maptype';
import { AppUtilities } from '@@/common/utils/app.utilities';
import { v4 } from 'uuid';
import { OnboardCompanyRequestUpdateDto } from './base-company-request/dto/onboard-company-request-update.dto';
import { SignUpDto } from '@@/auth/dto/signup.dto';
import { PrismaClientManager } from '@@/common/database/prisma-client-manager';
import { MessagingService } from '@@/common/messaging/messaging.service';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CompanyRequestAction } from '@@/common/enums';
import { BaseCompanyRequestService } from './base-company-request/base-company-request.service';
import { ConfigService } from '@nestjs/config';
import { BaseCompanyQueueProducer } from '../queue/producer';
import { CompanyService } from '@@/company/company.service';
import { GetAllCompaniesDto } from './dto/get-all-companies.dto';

@Injectable()
export class BaseCompanyService extends CrudService<
  Prisma.BaseCompanyDelegate,
  BaseCompanyMaptype
> {
  private MAX_TIME: number;
  private TIME_OUT: number;

  constructor(
    configService: ConfigService,
    private prismaClient: PrismaClient,
    private prismaClientManager: PrismaClientManager,
    private companyRequestService: BaseCompanyRequestService,
    private messagingService: MessagingService,
    private baseCompanyQueue: BaseCompanyQueueProducer,
    private companyService: CompanyService,
  ) {
    super(prismaClient.baseCompany);
    this.MAX_TIME = Number(configService.get('transaction_time.MAX_TIME'));
    this.TIME_OUT = Number(configService.get('transaction_time.TIME_OUT'));
  }

  async getAllCompanies(dto: GetAllCompaniesDto) {
    const {
      cursor,
      size,
      direction,
      orderBy,
      paginationType,
      page,
      ...filters
    } = dto;

    const parsedQueryFilters = this.parseQueryFilter(filters, ['name']);

    const args: Prisma.BaseCompanyFindManyArgs = {
      where: { ...parsedQueryFilters },
    };

    return this.findManyPaginate(args, {
      cursor,
      size,
      direction,
      orderBy: orderBy && AppUtilities.unflatten({ [orderBy]: direction }),
      paginationType,
      page,
    });
  }

  async getCompany(code: string) {
    return this.findFirstOrThrow({
      where: { code },
    });
  }

  async getCompanyURL(code: string) {
    const company = (await this.findUnique({
      where: {
        code,
      },
    })) as BaseCompany;

    if (!company) {
      throw new BadRequestException('This company domain does not exist');
    }

    const companyURL = new URL(
      `https://${company.code}.${process.env.APP_CLIENT_URL}/login`,
    );

    return { url: companyURL };
  }

  async forgotUserCompanies(email: string) {
    const user = await this.prismaClient.baseUser.findFirst({
      where: { email: email.toLowerCase() },
      select: {
        email: true,
        firstName: true,
        companies: {
          select: {
            company: {
              select: {
                name: true,
                code: true,
              },
            },
          },
        },
      },
    });

    if (!user)
      throw new NotFoundException(`User with email "${email}" not found`);

    if (!user.companies.length)
      throw new NotFoundException('User is not attached to any company');

    const data = user.companies.reduce((acc, { company }) => {
      const companyURL = new URL(
        `https://${company.code}.${process.env.APP_CLIENT_URL}`,
      );

      acc.push({ ...company, url: companyURL });
      return acc;
    }, []);

    this.messagingService.sendUserCompaniesEmail({
      email: user.email,
      firstName: user.firstName,
      companies: data,
    });
  }

  async activateCompany(id: string, dto: OnboardCompanyRequestUpdateDto) {
    const companyRequest = await this.prismaClient.baseCompanyRequest.findFirst(
      {
        where: { id },
      },
    );

    if (companyRequest.status === CompanyRequestStatus.Approved) {
      throw new NotAcceptableException('Company is already active!');
    }

    return await this.updateOnboardCompanyRequest(id, dto);
  }

  private async approveCompanyOnboardRequest(
    dto: SignUpDto,
    prisma: PrismaClient,
  ): Promise<BaseCompany> {
    let company: BaseCompany;
    let baseUser: BaseUser;
    try {
      ({ company, baseUser } = await this.setupBaseCompany(dto, prisma));

      if (!company) {
        throw new ServiceUnavailableException('Unable to setup tenant!');
      }

      const tenantPrismaClient =
        this.prismaClientManager.getCompanyPrismaClient(company.id);

      await this.companyService.setupCompany(dto, tenantPrismaClient);

      const token = AppUtilities.encode(
        JSON.stringify({ email: baseUser.email }),
      );

      this.baseCompanyQueue.sendOnboardingEmail({
        companyId: company.id,
        dto,
        token,
      });

      return company;
    } catch (error) {
      console.error(error);
      if (company) {
        await this.cleanUpTenant(company.id);
        throw new NotAcceptableException('Sign-up failed! Rollback completed.');
      }
      throw error;
    }
  }

  async cleanUpTenant(companyId: string) {
    const schemaResult = await this.prismaClient.$executeRawUnsafe(
      `DROP SCHEMA IF EXISTS "${companyId}" CASCADE`,
    );
    if (schemaResult !== 0) {
      throw new ServiceUnavailableException(
        `Unable to cleanup company records for company ID ${companyId}`,
      );
    }
  }

  async updateCompany(id: string, { status }: UpdateCompanyDto) {
    await this.update({
      where: { id },
      data: { status },
    });
  }

  async resendOrganizationOnboardingEmail(
    { userInfo, companyInfo }: SignUpDto,
    basePrisma: PrismaClient,
  ) {
    const company = await basePrisma.baseCompany.findFirstOrThrow({
      where: { email: companyInfo.email.toLowerCase() },
    });

    const token = AppUtilities.encode(
      JSON.stringify({ email: userInfo.email }),
    );

    await this.messagingService
      .sendCompanyOnboardingEmail(company.id, { userInfo, companyInfo }, token)
      .catch(console.error);
  }

  async setupBaseCompany(
    {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      companyInfo: { countryId, stateId, logo, values, ...companyInfo },
      userInfo,
    }: SignUpDto,
    prisma: PrismaClient,
  ) {
    const companyId = v4();

    // 1. setup company
    const company = await prisma.baseCompany.create({
      data: {
        ...companyInfo,
        id: companyId,
        ...(values?.length && {
          values: {
            createMany: {
              data: values,
              skipDuplicates: true,
            },
          },
        }),
        ...(countryId && { country: { connect: { id: countryId } } }),
        ...(stateId && { state: { connect: { id: stateId } } }),
      },
    });

    //2. Create Base User
    const baseUser = await prisma.baseUserCompany.create({
      data: {
        user: {
          connectOrCreate: {
            where: { email: userInfo.email.toLowerCase() },
            create: {
              firstName: userInfo.firstName,
              middleName: userInfo.middleName,
              lastName: userInfo.lastName,
              email: userInfo.email.toLowerCase(),
            },
          },
        },
        company: { connect: { id: company.id } },
      },
      include: {
        user: true,
      },
    });

    AppUtilities.removeSensitiveData(baseUser.user, 'password', true);

    await this.prismaClientManager.initializeCompanySchema(companyId);

    return { company, baseUser: baseUser.user };
  }

  async updateOnboardCompanyRequest(
    id: string,
    updateDto: OnboardCompanyRequestUpdateDto,
  ) {
    const prismaClient = this.prismaClientManager.getPrismaClient();
    const {
      contactInfo,
      status,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      contactEmail: _,
      ...companyInfo
    } = await this.companyRequestService.getRequestCompany(id);

    if (
      companyInfo.id &&
      status === CompanyRequestStatus.Pending &&
      updateDto.status === CompanyRequestStatus.Approved
    ) {
      return await prismaClient.$transaction(
        async (prisma: PrismaClient) => {
          await this.companyRequestService.updateCompanyRequest(
            id,
            updateDto,
            prisma,
          );

          return await this.approveCompanyOnboardRequest(
            {
              companyInfo,
              userInfo: contactInfo as any,
            },
            prisma,
          );
        },
        {
          maxWait: this.MAX_TIME,
          timeout: this.TIME_OUT,
        },
      );
    } else if (
      updateDto.action === CompanyRequestAction.ResendActivationEmail
    ) {
      return this.resendOrganizationOnboardingEmail(
        {
          companyInfo,
          userInfo: contactInfo as any,
        },
        prismaClient,
      );
    }

    return await this.companyRequestService.updateCompanyRequest(id, updateDto);
  }
}
