import { createMongoAbility, MongoAbility } from '@casl/ability';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PermissionAction } from '@@/auth/interfaces';
import { PrismaClient } from '@@prisma/company';

export type PermissionObjectType = any;
export type AppAbility = MongoAbility;

interface RawRule {
  action: string | string[];
  subject: string | string[];
  /** an array of fields to which user has (or not) access */
  fields?: string[];
  /** an object of conditions which restricts the rule scope */
  conditions?: any;
  /** indicates whether rule allows or forbids something */
  inverted?: boolean;
  /** message which explains why rule is forbidden */
  reason?: string;
}

@Injectable()
export class CaslAbilityFactory {
  constructor(private prismaClient: PrismaClient) {}

  async createForUser(userId: string) {
    const user = await this.prismaClient.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!user) throw new NotFoundException('User not found!');

    const userRoles = await this.prismaClient.role.findFirst({
      where: { id: user.roleId },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    const caslPermissions: RawRule[] = userRoles.permissions.map(
      ({ permission }) => ({
        action: permission.action as PermissionAction,
        subject: permission.subject,
      }),
    );

    return createMongoAbility(caslPermissions);
  }
}
