import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UploadUserPhotoDto {
  @ApiProperty({
    type: String,
    format: 'binary',
  })
  @IsOptional()
  photo?: Express.Multer.File;
}
