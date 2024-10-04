import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CsvService } from './csv.service';
import { AuthStrategyType, RequestWithUser } from '@@/auth/interfaces';
import {
  allowedCsvMimeTypes,
  CREATE_EMPLOYEE_FIELDS,
  CSV_UPLOAD_MAX_SIZE_BYTES,
} from '@@/common/constants';
import { ApiResponseMeta } from '@@/common/decorators/response.decorator';
import { DocumentUploadInterceptor } from '@@/common/interceptors/document.interceptor';
import {
  ApiOperation,
  ApiConsumes,
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';
import { UploadCsvDto } from './dto/upload-csv.dto';
import { AuthStrategy } from '@@/common/decorators/strategy.decorator';
import { AppUtilities } from '@@/common/utils/app.utilities';
import { MappedHeadersDto } from './dto/mapped-headers.dto';

@ApiTags('CSV')
@ApiBearerAuth()
@AuthStrategy(AuthStrategyType.JWT)
@Controller('csv')
export class CsvController {
  constructor(private csvService: CsvService) {}

  @ApiOperation({ summary: 'Get CSV form fields' })
  @AuthStrategy(AuthStrategyType.PUBLIC)
  @Get('form-fields')
  async getFormFields() {
    return AppUtilities.convertEnumToObject(CREATE_EMPLOYEE_FIELDS);
  }

  @ApiResponseMeta({ message: 'CSV file uploaded successfully' })
  @ApiOperation({ summary: 'Upload employee CSV file' })
  @ApiConsumes('multipart/form-data')
  @Post('upload')
  @UseInterceptors(
    new DocumentUploadInterceptor().createInterceptor(
      'file',
      allowedCsvMimeTypes,
      null,
      CSV_UPLOAD_MAX_SIZE_BYTES,
    ),
  )
  async uploadCSV(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadCsvDto,
    @Req() req: RequestWithUser,
  ) {
    dto.file = file;

    return await this.csvService.uploadCSV(dto, req);
  }

  @ApiResponseMeta({ message: 'CSV processing started.' })
  @ApiOperation({ summary: 'Process CSV file' })
  @ApiBearerAuth()
  @Patch(':uploadId/process')
  async processCSV(
    @Param('uploadId', ParseUUIDPipe) uploadId: string,
    @Body() dto: MappedHeadersDto,
    @Req() req: RequestWithUser,
  ) {
    return await this.csvService.processUpload(uploadId, dto, req);
  }
}
