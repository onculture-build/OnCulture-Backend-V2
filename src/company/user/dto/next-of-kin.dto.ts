import { RelationshipType } from '@@/common/enums';
import { IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';

export class NextOfKinDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsEnum(RelationshipType)
  relationship: RelationshipType;
}
