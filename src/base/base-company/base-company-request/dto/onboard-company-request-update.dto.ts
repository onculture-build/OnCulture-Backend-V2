import { CompanyRequestStatus, CompanyRequestAction } from '@@/common/enums';
import { IsEnum, ValidateIf } from 'class-validator';

export class OnboardCompanyRequestUpdateDto {
  @IsEnum(CompanyRequestStatus)
  @ValidateIf((obj, val) => !!val || !obj.action)
  status?: CompanyRequestStatus;

  @IsEnum(CompanyRequestAction)
  @ValidateIf((obj, val) => !!val || !obj.status)
  action?: CompanyRequestAction;
}
