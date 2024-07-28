import { CrudService } from '@@/common/database/crud.service';
import { Injectable, NotAcceptableException } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { BaseCompanyRequestMapType } from './base-company-request.maptype';
import { SignUpDto } from '@@/auth/dto/signup.dto';
import { OnboardCompanyRequestUpdateDto } from './dto/onboard-company-request-update.dto';
import { GetCompanyRequestsDto } from './dto/get-company-requests.dto';
import { CompanyRequestStatus } from '@@/common/enums';
import { AppUtilities } from '@@/common/utils/app.utilities';

@Injectable()
export class BaseCompanyRequestService extends CrudService<
  Prisma.BaseCompanyRequestDelegate,
  BaseCompanyRequestMapType
> {
  constructor(private readonly prismaClient: PrismaClient) {
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
      {
        key: 'term',
        where: (term) => ({
          name: {
            contains: term,
            mode: 'insensitive',
          },
        }),
      },
      { key: 'status', where: (status) => ({ status: status === 'true' }) },
    ]);

    const args: Prisma.BaseCompanyRequestFindManyArgs = {
      where: { ...parsedQueryFilters, status: CompanyRequestStatus.Pending },
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
    
    await this.validateCompanyRequestData({
      userInfo,
      companyInfo,
    });
    return this.create({
      data: {
        ...companyInfo,
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

  async validateCompanyRequestData({ userInfo, companyInfo }: SignUpDto) {
    const uniqueCountryIds = [
      companyInfo.countryId,
    ];
    const countries = await this.prismaClient.baseCountry.findMany({
      where: { id: { in: uniqueCountryIds } },
    });

    if (uniqueCountryIds.length > countries.length) {
      throw new NotAcceptableException('Invalid country Id(s).');
    }

    const uniqueStateIds = [
      companyInfo.stateId
    ];

    const states = await this.prismaClient.baseState.findMany({
      where: { id: { in: uniqueStateIds } },
    });
    if (uniqueStateIds.length > states.length) {
      throw new NotAcceptableException('Invalid state Id(s).');
    }
  }
}
