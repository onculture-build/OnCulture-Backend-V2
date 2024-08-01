import { SignUpDto } from '@@/auth/dto/signup.dto';

export const QUEUE = 'onculture:base:';

export enum JOBS {
  SEND_ONBOARDING_EMAIL = 'sendOnboardingEmail',
  PROCESS_ONBOARD_COMPANY = 'processOnboardCompany',
}

export interface ISendOnboardingEmail {
  companyId: string;
  dto: SignUpDto;
}

export interface IProcessOnboardCompany {
  companyId: string;
}
