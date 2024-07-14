import { Module } from '@nestjs/common';
import { PasswordPolicyService } from './password-policy.service';

@Module({
  providers: [PasswordPolicyService]
})
export class PasswordPolicyModule {}
