import { SignUpDto } from '@@/auth/dto/signup.dto';

export const QUEUE = 'onculture:base:';

export enum JOBS {
  SEND_ONBOARDING_EMAIL = 'sendOnboardingEmail',
}

export interface ISendOnboardingEmail {
  companyId: string;
  dto: SignUpDto;
  password: string;
}
