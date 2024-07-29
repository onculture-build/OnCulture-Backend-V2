import { CompanyRequestStatus, CompanyRequestAction } from '@@/common/enums';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, ValidateIf } from 'class-validator';

export class OnboardCompanyRequestUpdateDto {
  @ApiPropertyOptional({ enum: CompanyRequestStatus })
  @IsEnum(CompanyRequestStatus)
  @ValidateIf((obj, val) => !!val || !obj.action)
  status?: CompanyRequestStatus;

  @ApiPropertyOptional({ enum: CompanyRequestAction })
  @IsEnum(CompanyRequestAction)
  @ValidateIf((obj, val) => !!val || !obj.status)
  action?: CompanyRequestAction;
}
