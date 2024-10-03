import { ApiProperty } from '@nestjs/swagger';

export class UploadCsvDto {
  @ApiProperty({
    type: String,
    format: 'binary',
  })
  file: Express.Multer.File;
}
