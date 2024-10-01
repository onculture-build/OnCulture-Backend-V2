import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { S3FilePrivacy } from '../file.enum';

export class UploadFileDto {
  @IsNotEmpty()
  @IsEnum(S3FilePrivacy)
  privacy?: S3FilePrivacy;

  @IsNotEmpty()
  imageBuffer: Buffer;

  @IsOptional()
  @IsString()
  filePath?: string;
}
