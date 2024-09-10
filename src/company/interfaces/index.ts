import { UserInfoDto } from '@@/auth/dto/user-info.dto';

export const QUEUE = 'onculture:company:';

export enum JOBS {
  SEND_EMPLOYEE_SETUP_EMAIL = 'sendEmployeeSetupEmail',
}

export interface ISendEmployeeSetupEmail {
  code: string;
  dto: UserInfoDto;
  password?: string;
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

export enum EmploymentType {
  Fulltime = 'Fulltime',
  Contract = 'Contract',
  Internship = 'Internship',
}
