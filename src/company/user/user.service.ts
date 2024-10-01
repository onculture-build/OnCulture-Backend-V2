/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaClientManager } from '@@/common/database/prisma-client-manager';
import {
  ConflictException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, PrismaClient } from '@@prisma/client';
import {
  Prisma as CompanyPrisma,
  PrismaClient as CompanyPrismaClient,
  User,
} from '@@prisma/company';
import { RequestWithUser } from '@@/auth/interfaces';
import { CrudService } from '@@/common/database/crud.service';
import { UserMapType } from './user.maptype';
import { UserInfoDto } from '@@/auth/dto/user-info.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AddressPurpose } from '@@/common/enums';

@Injectable()
export class UserService extends CrudService<
  CompanyPrisma.UserDelegate,
  UserMapType
> {
  constructor(
    private basePrismaClient: PrismaClient,
    private companyPrismaClient: CompanyPrismaClient,
    private prismaClientManager: PrismaClientManager,
  ) {
    super(companyPrismaClient.user);
  }

  async createUser(
    userInfo: UserInfoDto,
    req?: RequestWithUser,
    prisma?: CompanyPrismaClient,
  ) {
    const basePrisma = this.prismaClientManager.getPrismaClient();

    const companyCode = req ? (req['company'] as string) : undefined;

    const companyPrisma =
      prisma ??
      (await this.prismaClientManager.getCompanyPrismaClientFromRequest(req));

    const whereClause: any = {
      ...(userInfo?.email && { user: { email: userInfo.email.toLowerCase() } }),
      ...(companyCode && { company: { code: companyCode } }),
    };

    if (Object.keys(whereClause).length === 2) {
      const existingUser = await basePrisma.baseUserCompany.findFirst({
        where: whereClause,
      });

      if (existingUser)
        throw new ConflictException('A user with this email already exists');

      return basePrisma.$transaction(async (prisma: PrismaClient) => {
        await prisma.baseUserCompany.create({
          data: {
            user: {
              create: {
                firstName: userInfo.firstName,
                middleName: userInfo.middleName,
                lastName: userInfo.lastName,
                email: userInfo.email.toLowerCase(),
              },
            },
            company: {
              connect: { code: companyCode },
            },
          },
        });

        return this.setupCompanyUser(userInfo, req, companyPrisma);
      });
    }

    return await this.setupCompanyUser(userInfo, req, companyPrisma);
  }

  async setupCompanyUser(
    userInfo: UserInfoDto,
    authUser?: RequestWithUser,
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
      const user = await prisma.user.create({
        data: {
          ...restUserInfo,
          ...(authUser && { createdBy: authUser.user.userId }),
          ...(email && {
            emails: { create: { email: email.toLowerCase(), isPrimary: true } },
          }),
          ...(phone && { phones: { create: { phone, isPrimary: true } } }),
          ...(stateId && { state: { connect: { id: stateId } } }),
          ...(countryId && { country: { connect: { id: countryId } } }),
          ...(roleId && { role: { connect: { id: roleId } } }),
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

  async updateUser(
    id: string,
    {
      bank,
      email,
      phone,
      nextOfKin,
      emergencyContact,
      roleId,
      stateId,
      countryId,
      alternateEmail,
      ...dto
    }: UpdateUserDto,
    prisma?: CompanyPrismaClient,
    req?: RequestWithUser,
  ) {
    const client = prisma ?? this.companyPrismaClient;
    const user = await client.user.findFirst({
      where: { id },
    });

    if (!user) throw new NotFoundException('User not found');

    const updateData: any = {
      ...dto,
      updatedBy: req?.user?.userId,
    };

    if (alternateEmail) {
      await this.updateUserEmail(id, alternateEmail, undefined, req);
    }

    if (phone) {
      await this.updateUserPhone(id, phone, undefined, req);
    }

    if (stateId) {
      updateData.state = { connect: { id: stateId } };
    }

    if (countryId) {
      updateData.country = { connect: { id: countryId } };
    }

    if (bank) {
      updateData.bank = {
        upsert: {
          create: bank,
          update: bank,
        },
      };
    }

    if (nextOfKin) {
      updateData.nextOfKin = {
        upsert: {
          create: nextOfKin,
          update: nextOfKin,
        },
      };
    }

    if (emergencyContact) {
      updateData.emergencyContact = {
        upsert: {
          create: emergencyContact,
          update: emergencyContact,
        },
      };
    }

    return client.user.update({
      where: { id },
      data: updateData,
    });
  }

  async updateUserDefaultEmail(
    id: string,
    email: string,
    req?: RequestWithUser,
    prisma?: CompanyPrismaClient,
  ) {
    const client = prisma ?? this.companyPrismaClient;
    const defaultEmail = await client.userEmail.findFirst({
      where: {
        userId: id,
        isPrimary: true,
      },
    });

    // update the base table for the user.
    const baseUser = await this.basePrismaClient.baseUser.findFirst({
      where: { email: defaultEmail.email },
    });

    const baseCompany = await this.basePrismaClient.baseCompany.findUnique({
      where: {
        code: req['company'],
      },
    });

    await this.basePrismaClient.baseUserCompany.update({
      where: {
        userId_companyId: {
          userId: baseUser.id,
          companyId: baseCompany.id,
        },
      },
      data: {
        user: {
          update: {
            email,
          },
        },
      },
    });

    // update the core table for the user.
    client.userEmail.update({
      where: {
        userId_email: {
          userId: id,
          email: defaultEmail.email,
        },
      },
      data: {
        email,
        updatedBy: req?.user?.userId,
      },
    });
  }

  async updateUserAddress(
    id: string,
    address: string,
    prisma?: CompanyPrismaClient,
    req?: RequestWithUser,
  ) {
    const client = prisma ?? this.companyPrismaClient;

    return client.$transaction(async (cPrisma: CompanyPrismaClient) => {
      await cPrisma.userAddress.updateMany({
        where: {
          userId: id,
          purpose: AddressPurpose.PRIMARY,
        },
        data: {
          purpose: AddressPurpose.OLD,
          status: false,
        },
      });

      await cPrisma.userAddress.upsert({
        where: {
          userId_purpose: {
            userId: id,
            purpose: AddressPurpose.PRIMARY,
          },
        },
        create: {
          address1: address,
          user: { connect: { id } },
          createdBy: req?.user?.userId,
        },
        update: {},
      });
    });
  }

  async updateUserEmail(
    id: string,
    email: string,
    prisma?: CompanyPrismaClient,
    req?: RequestWithUser,
  ) {
    const client = prisma ?? this.companyPrismaClient;

    return client.$transaction(async (cPrisma: CompanyPrismaClient) => {
      await cPrisma.userEmail.updateMany({
        where: {
          userId: id,
          isPrimary: false,
        },
        data: {
          status: false,
        },
      });

      await cPrisma.userEmail.upsert({
        where: {
          userId_email: {
            userId: id,
            email: email?.toLowerCase(),
          },
        },
        create: {
          email: email?.toLowerCase(),
          isPrimary: false,
          user: { connect: { id } },
          createdBy: req?.user?.userId,
        },
        update: {},
      });
    });
  }

  async updateUserPhone(
    id: string,
    phone: string,
    prisma?: CompanyPrismaClient,
    req?: RequestWithUser,
  ) {
    const client = prisma ?? this.companyPrismaClient;

    return client.$transaction(async (cPrisma: CompanyPrismaClient) => {
      await cPrisma.userPhone.updateMany({
        where: {
          userId: id,
          phone: {
            not: phone,
          },
        },
        data: {
          status: false,
        },
      });

      await cPrisma.userPhone.upsert({
        where: {
          userId_phone: {
            userId: id,
            phone,
          },
        },
        create: {
          phone,
          isPrimary: true,
          user: { connect: { id } },
          createdBy: req?.user?.userId,
        },
        update: {},
      });
    });
  }
}
