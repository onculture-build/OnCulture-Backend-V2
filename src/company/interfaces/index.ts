import { UserInfoDto } from '@@/auth/dto/user-info.dto';
import { IntegrationMemberDto } from '../employee/dto/create-employee-integration.dto';

export const QUEUE = 'onculture:company:';

export enum JOBS {
  SEND_EMPLOYEE_SETUP_EMAIL = 'sendEmployeeSetupEmail',
  CREATE_EMPLOYEES_BULK = 'createEmployeeBulk',
}

export interface ISendEmployeeSetupEmail {
  code: string;
  dto: UserInfoDto;
  token: string;
}

export interface CreateEmployeeIntegration {
  dto: IntegrationMemberDto;
  companyId: string;
  code: string;
}

export enum UsersOrderColumns {
  Name = 'name',
  Email = 'email',
  Role = 'role',
  LastLogin = 'lastLogin',
  Status = 'status',
}

export const MapUsersOrderByToValue = {
  name: 'firstName',
  email: 'emails._count',
  role: 'role.name',
  lastLogin: 'lastLogin',
  status: 'status',
};

export const MapEmployeesOrderByToValue = {
  name: 'user.firstName',
  employmentType: 'employmentType',
  status: 'status',
};

export enum EmployeeOrderColumns {
  Name = 'name',
  EmploymentType = 'employmentType',
  Status = 'status',
}

export interface IntegrationQuery {
  integration_type?: string;
  version?: string;
  environment?: string;
  source?: string;
}
