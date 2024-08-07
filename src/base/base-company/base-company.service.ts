/* eslint-disable @typescript-eslint/no-unused-vars */
import { CrudService } from '@@/common/database/crud.service';
import {
  Injectable,
  NotAcceptableException,
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
import { UserService } from '@@/company/user/user.service';
import { roleSeed } from '@@/common/database/seed-data/company/company-role.seed';

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
    private companyUserService: UserService,
  ) {
    super(prismaClient.baseCompany);
    this.MAX_TIME = Number(configService.get('transaction_time.MAX_TIME'));
    this.TIME_OUT = Number(configService.get('transaction_time.TIME_OUT'));
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

      const roleId = roleSeed[0].id;

      const tenantPrismaClient =
        this.prismaClientManager.getCompanyPrismaClient(company.id);

      await this.companyUserService.setupCompanyUser(
        {
          userInfo: { ...dto.userInfo, roleId },
          employeeInfo: { employeeNo: '00000' },
        },
        undefined,
        tenantPrismaClient,
      );

      this.baseCompanyQueue.sendOnboardingEmail({
        companyId: company.id,
        dto,
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

    await this.messagingService
      .sendCompanyOnboardingEmail(company.id, { userInfo, companyInfo })
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
        ...(values && {
          values: {
            createMany: {
              data: values.map((value) => ({ value })),
              skipDuplicates: true,
            },
          },
        }),
        country: { connect: { id: countryId } },
        state: { connect: { id: stateId } },
      },
    });

    //2. Create Base User
    const baseUser = await prisma.baseUser.create({
      data: {
        firstName: userInfo.firstName,
        middleName: userInfo.middleName,
        lastName: userInfo.lastName,
        email: userInfo.email.toLowerCase(),
        companies: { create: { companyId: company.id } },
      },
    });

    await this.prismaClientManager.initializeCompanySchema(companyId);

    return { company, baseUser };
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
