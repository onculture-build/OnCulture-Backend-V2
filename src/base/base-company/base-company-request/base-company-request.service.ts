import { CrudService } from '@@/common/database/crud.service';
import {
  ConflictException,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { BaseCompanyRequestMapType } from './base-company-request.maptype';
import { SignUpDto } from '@@/auth/dto/signup.dto';
import { OnboardCompanyRequestUpdateDto } from './dto/onboard-company-request-update.dto';
import { GetCompanyRequestsDto } from './dto/get-company-requests.dto';
import { AppUtilities } from '@@/common/utils/app.utilities';
import { CompanyDetailsUpdateDto } from './dto/company-details-update.dto';

@Injectable()
export class BaseCompanyRequestService extends CrudService<
  Prisma.BaseCompanyRequestDelegate,
  BaseCompanyRequestMapType
> {
  constructor(private prismaClient: PrismaClient) {
    super(prismaClient.baseCompanyRequest);
  }

  async getRequestCompany(id: string) {
    return this.findFirstOrThrow({
      where: { id },
    });
  }

  async getOnboardCompanyRequests({
    page,
    size,
    orderBy,
    cursor,
    direction,
    paginationType,
    ...filters
  }: GetCompanyRequestsDto) {
    const parsedQueryFilters = this.parseQueryFilter(filters, [
      'name',
      'status',
      {
        key: 'term',
        where: (term) => ({
          name: {
            contains: term,
            mode: 'insensitive',
          },
        }),
      },
    ]);

    const args: Prisma.BaseCompanyRequestFindManyArgs = {
      where: { ...parsedQueryFilters },
    };

    return await this.findManyPaginate(args, {
      page,
      size,
      cursor,
      direction,
      orderBy: orderBy && AppUtilities.unflatten({ [orderBy]: direction }),
      paginationType,
    });
  }

  async setupCompanyRequest({ userInfo, companyInfo }: SignUpDto) {
    if (companyInfo.countryId) {
      await this.validateCompanyRequestData({
        userInfo,
        companyInfo,
      });
    }
    return this.create({
      data: {
        ...companyInfo,
        ...(companyInfo.countryId && {
          country: { connect: { id: companyInfo.countryId } },
        }),
        ...(companyInfo.stateId && {
          state: { connect: { id: companyInfo.stateId } },
        }),
        ...(companyInfo.values && {
          values: companyInfo.values as unknown as any[],
        }),
        contactEmail: userInfo.email,
        contactInfo: userInfo as any,
      },
    });
  }

  async updateCompanyRequest(
    id: string,
    updateDto: OnboardCompanyRequestUpdateDto,
    prisma: PrismaClient = this.prismaClient,
  ) {
    const dto: Prisma.BaseCompanyRequestUpdateArgs = {
      where: { id },
      data: {
        ...updateDto,
      },
    };
    return await prisma.baseCompanyRequest.update(dto);
  }

  async updateCompanyDetails(
    id: string,
    updateDto: CompanyDetailsUpdateDto,
    prisma: PrismaClient = this.prismaClient,
  ) {
    const { values, ...others } = updateDto;
    const updateValues = values.filter((value) => value.id);
    const createValues = values.filter((value) => !value.id);
    const dto: Prisma.BaseCompanyUpdateArgs = {
      where: { id },
      data: {
        ...others,
        values: {
          update: updateValues.map((value) => ({
            where: { id: value.id },
            data: {
              value: value.value,
            },
          })),
          create: createValues.map((value) => ({
            value: value.value,
          })),
        },
      },
    };
    return await prisma.baseCompany.update(dto);
  }
  async validateCompanyRequestData({ userInfo, companyInfo }: SignUpDto) {
    const existingCompanyRequest = await this.findUnique({
      where: {
        email: companyInfo.email.toLowerCase(),
      },
    });

    if (existingCompanyRequest)
      throw new ConflictException('Company with email already exists');

    const uniqueCountryIds = [
      ...new Set([companyInfo.countryId, userInfo.countryId]),
    ];
    const countries = await this.prismaClient.baseCountry.findMany({
      where: { id: { in: uniqueCountryIds } },
    });

    if (uniqueCountryIds.length > countries.length) {
      throw new NotAcceptableException('Invalid country Id(s).');
    }

    const uniqueStateIds = [
      ...new Set([companyInfo.stateId, userInfo.stateId]),
    ];

    const states = await this.prismaClient.baseState.findMany({
      where: { id: { in: uniqueStateIds } },
    });
    if (uniqueStateIds.length > states.length) {
      throw new NotAcceptableException('Invalid state Id(s).');
    }
  }
}
