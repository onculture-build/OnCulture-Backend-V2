import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UploadLogoDto {
  @ApiPropertyOptional({
    type: String,
    format: 'binary',
    example: 'logo',
  })
  @IsOptional()
  logo?: Express.Multer.File;
}
