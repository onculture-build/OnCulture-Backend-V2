/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaClientManager } from '@@/common/database/prisma-client-manager';
import { Injectable, NotAcceptableException } from '@nestjs/common';
import {
  Prisma as CompanyPrisma,
  PrismaClient as CompanyPrismaClient,
  CompanyUser,
} from '@@prisma/company';
import { JwtPayload, RequestWithUser } from '@@/auth/interfaces';
import { AppUtilities } from '@@/common/utils/app.utilities';
import { PrismaClient } from '@prisma/client';
import { SetupUserDto } from './dto/setup-user.dto';
import { CompanyUserQueueProducer } from '../queue/producer';
import { CrudService } from '@@/common/database/crud.service';
import { CompanyUserMapType } from './user.maptype';
import { EmployeeService } from '../employee/employee.service';

@Injectable()
export class UserService extends CrudService<
  CompanyPrisma.CompanyUserDelegate,
  CompanyUserMapType
> {
  constructor(
    private companyPrismaClient: CompanyPrismaClient,
    private companyQueueProducer: CompanyUserQueueProducer,
    private employeeService: EmployeeService,
    private prismaClientManager: PrismaClientManager,
  ) {
    super(companyPrismaClient.companyUser);
  }

  async createUser(dto: SetupUserDto, auth: RequestWithUser) {
    const basePrisma = this.prismaClientManager.getPrismaClient();
    const companyPrisma = this.prismaClientManager.getCompanyPrismaClient(
      auth.user.companyId,
    );

    return basePrisma.$transaction(async (prisma: PrismaClient) => {
      const { userInfo } = dto;

      const password = AppUtilities.generatePassword(10);

      await prisma.baseUser.create({
        data: {
          firstName: userInfo.firstName,
          middleName: userInfo.middleName,
          lastName: userInfo.lastName,
          email: userInfo.email.toLowerCase(),
          password,
          companies: { connect: { id: auth.user.companyId } },
        },
      });

      return companyPrisma.$transaction(async (prisma: CompanyPrismaClient) => {
        await this.setupCompanyUser(dto, auth.user, prisma);

        await this.companyQueueProducer.sendUserSetupEmail({
          companyId: auth.user.companyId,
          dto: { email: userInfo.email, ...userInfo },
          password,
        });
      });
    });
  }

  async setupCompanyUser(
    { userInfo, employeeInfo }: SetupUserDto,
    authUser?: JwtPayload,
    prisma?: CompanyPrismaClient,
  ): Promise<CompanyUser | undefined> {
    const client = prisma || this.companyPrismaClient;

    const {
      roleId,
      email,
      phone,
      phoneCountry,
      stateId,
      countryId,
      ...restUserInfo
    } = userInfo;

    const role = await client.coreRole.findFirst({
      where: { id: roleId },
    });

    if (!role) {
      throw new NotAcceptableException('User assigned role does not exist!');
    }

    const executeSetupUser = async (prisma: CompanyPrismaClient) => {
      const employee = await this.employeeService.createEmployee(
        employeeInfo,
        prisma,
      );
      const user = await prisma.companyUser.create({
        data: {
          ...restUserInfo,
          createdBy: authUser?.userId,
          updatedBy: authUser?.userId,
          ...(email && {
            emails: { create: { email: email.toLowerCase(), isPrimary: true } },
          }),
          ...(phone && { phones: { create: { phone, isPrimary: true } } }),
          ...(stateId && { state: { connect: { id: stateId } } }),
          ...(countryId && { country: { connect: { id: countryId } } }),
          employee: { connect: { id: employee.id } },
          role: { connect: { id: roleId } },
        },
      });
      return user;
    };

    return prisma
      ? await executeSetupUser(prisma)
      : await client.$transaction(
          async (tPrisma: CompanyPrismaClient) =>
            await executeSetupUser(tPrisma),
        );
  }
}
