import { IsNotEmpty, IsString } from 'class-validator';
import { UploadFileDto } from './upload-file.dto';

export class CreateFileDto extends UploadFileDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
