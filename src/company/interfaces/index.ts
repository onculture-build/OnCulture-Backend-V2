import { UserInfoDto } from '@@/auth/dto/user-info.dto';
import { CreateEmployeeDto } from '../employee/dto/create-employee.dto';

export const QUEUE = 'onculture:company:';

export enum JOBS {
  SEND_EMPLOYEE_SETUP_EMAIL = 'sendEmployeeSetupEmail',
  PROCESS_EMPLOYEE_CSV_UPLOAD = 'processEmployeeCsvUpload',
}

export interface ISendEmployeeSetupEmail {
  code: string;
  dto: UserInfoDto;
  token: string;
}

export interface IProcessEmployeeCsvUpload {
  uploadId: string;
  companyId: string;
  records: any[];
}

export interface IEmployeeCsvRecord extends CreateEmployeeDto {}

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

export const MapEmploymentTypesOrderByToValue = {
  title: 'title',
  status: 'status',
};

export const MapRolesOrderByToValue = {
  name: 'name',
  code: 'code',
  type: 'type',
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

export enum FileUploadStatus {
  Pending = 'Pending',
  Processing = 'Processing',
  Completed = 'Completed',
  Failed = 'Failed',
}
