/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaClientManager } from '@@/common/database/prisma-client-manager';
import { Injectable, NotAcceptableException } from '@nestjs/common';
import {
  Prisma as CompanyPrisma,
  PrismaClient as CompanyPrismaClient,
  User,
} from '@@prisma/company';
import { JwtPayload, RequestWithUser } from '@@/auth/interfaces';
import { PrismaClient } from '@prisma/client';
import { SetupUserDto } from './dto/setup-user.dto';
import { CompanyUserQueueProducer } from '../queue/producer';
import { CrudService } from '@@/common/database/crud.service';
import { UserMapType } from './user.maptype';
import { EmployeeService } from '../employee/employee.service';

@Injectable()
export class UserService extends CrudService<
  CompanyPrisma.UserDelegate,
  UserMapType
> {
  constructor(
    private companyPrismaClient: CompanyPrismaClient,
    private companyQueueProducer: CompanyUserQueueProducer,
    private employeeService: EmployeeService,
    private prismaClientManager: PrismaClientManager,
  ) {
    super(companyPrismaClient.user);
  }

  async createUser(dto: SetupUserDto, req: RequestWithUser) {
    const basePrisma = this.prismaClientManager.getPrismaClient();
    const companyPrisma =
      await this.prismaClientManager.getCompanyPrismaClientFromRequest(req);

    return basePrisma.$transaction(async (prisma: PrismaClient) => {
      const { userInfo } = dto;

      await prisma.baseUser.create({
        data: {
          firstName: userInfo.firstName,
          middleName: userInfo.middleName,
          lastName: userInfo.lastName,
          email: userInfo.email.toLowerCase(),
          // companies: { connect: { company: { code: req['company'] } } },
        },
      });

      return companyPrisma.$transaction(async (prisma: CompanyPrismaClient) => {
        await this.setupCompanyUser(dto, req.user, prisma);

        await this.companyQueueProducer.sendUserSetupEmail({
          // companyId: req.user.,
          companyId: '',
          dto: { email: userInfo.email, ...userInfo },
        });
      });
    });
  }

  async setupCompanyUser(
    { userInfo, employeeInfo }: SetupUserDto,
    authUser?: JwtPayload,
    prisma?: CompanyPrismaClient,
  ): Promise<User | undefined> {
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

    const role = await client.role.findFirst({
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

      const user = await prisma.user.create({
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
          async (cPrisma: CompanyPrismaClient) =>
            await executeSetupUser(cPrisma),
        );
  }
}
