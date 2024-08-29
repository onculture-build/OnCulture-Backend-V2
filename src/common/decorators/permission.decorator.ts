import { PermissionObjectType } from '@@/auth/casl/casl-ability.factory/casl-ability.factory';
import { PermissionAction } from '@@/auth/interfaces';
import { CustomDecorator, SetMetadata } from '@nestjs/common';

export type Condition = any;
export type RequiredPermission = [
  PermissionAction,
  PermissionObjectType,
  Condition?,
];
export const PERMISSION_CHECKER_KEY = 'permission_checker_params_key';
export const CheckPermissions = (
  ...params: RequiredPermission[]
): CustomDecorator<string> => SetMetadata(PERMISSION_CHECKER_KEY, params);
