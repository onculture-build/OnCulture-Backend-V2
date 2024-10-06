import { RequestWithUser } from '@@/auth/interfaces';
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { UploadCsvDto } from './dto/upload-csv.dto';
import * as csvParser from 'csv-parser';
import { FileService } from '@@/common/file/file.service';
import { Readable } from 'stream';
import { MappedHeadersDto } from './dto/mapped-headers.dto';
import { PrismaClient } from '@@prisma/company';
import { AppUtilities } from '@@/common/utils/app.utilities';
import { CompanyUserQueueProducer } from '@@/company/queue/producer';
import {
  FileUploadStatus,
  IProcessEmployeeCsvUpload,
} from '@@/company/interfaces';
import { PrismaClient as BasePrismaClient } from '@prisma/client';
import { EMPLOYEE_MAPPINGS } from '@@/common/constants';

@Injectable()
export class CsvService {
  constructor(
    private readonly fileService: FileService,
    private prismaClient: PrismaClient,
    private basePrismaClient: BasePrismaClient,
    private queueProducer: CompanyUserQueueProducer,
  ) {}

  async uploadCSV({ file }: UploadCsvDto, req: RequestWithUser) {
    return this.prismaClient.$transaction(async (prisma: PrismaClient) => {
      const parsedData = await this.parseCsvHeadersAndRows(file.buffer);

      const csvKey = `csv-${file.originalname.toLowerCase()}`;
      const uploadedFile = await this.fileService.uploadFile(
        { imageBuffer: file.buffer },
        csvKey,
        'private',
      );

      const fileRecord = await prisma.fileUpload.create({
        data: {
          file: {
            connectOrCreate: {
              create: {
                name: csvKey,
                key: uploadedFile.key,
                eTag: uploadedFile.eTag,
                createdBy: req?.user?.userId,
              },
              where: {
                key: uploadedFile.key,
              },
            },
          },
        },
      });

      return { data: parsedData, uploadId: fileRecord.id };
    });
  }

  async processUpload(
    uploadId: string,
    mappedHeaders: MappedHeadersDto,
    req: RequestWithUser,
  ) {
    return this.prismaClient.$transaction(async (prisma: PrismaClient) => {
      const upload = await prisma.fileUpload.findUnique({
        where: { id: uploadId },
        select: {
          file: {
            select: {
              key: true,
            },
          },
          status: true,
        },
      });

      if (!upload) {
        throw new NotFoundException('File upload not found');
      }

      switch (upload.status) {
        case FileUploadStatus.Processing:
          throw new BadRequestException(
            'File upload is already being processed',
          );
        case FileUploadStatus.Completed:
          throw new BadRequestException(
            'File cannot be processed because upload is already completed',
          );
        default:
          await prisma.fileUpload.update({
            where: { id: uploadId },
            data: {
              status: 'Processing',
            },
          });
      }

      const uploadedFile = await this.fileService.getFileAsStream(
        upload.file.key,
      );

      const fileBuffer = await AppUtilities.streamToBuffer(uploadedFile);

      const records = await this.parseCSV(fileBuffer, mappedHeaders);

      const transformedRecords = records.map((record) =>
        AppUtilities.transformObject(record, EMPLOYEE_MAPPINGS),
      );

      const company = await this.basePrismaClient.baseCompany.findUnique({
        where: {
          code: req['company'],
        },
      });

      const data: IProcessEmployeeCsvUpload = {
        records: transformedRecords,
        uploadId,
        companyId: company.id,
      };

      this.queueProducer.processEmployeeCsvUpload(data);
    });
  }

  private async parseCsvHeadersAndRows(
    buffer: Buffer,
  ): Promise<Array<{ header: string; sampleData: string[] }>> {
    return new Promise((resolve, reject) => {
      const stream = Readable.from(buffer);
      const parser = csvParser();
      const headerData: { [key: string]: string[] } = {};
      let headers: string[] = [];
      let rowCount = 0;

      parser.on('headers', (headerList: string[]) => {
        headers = headerList;
        headers.forEach((header) => {
          headerData[header] = [];
        });
      });

      parser.on('data', (row) => {
        if (rowCount < 3) {
          headers.forEach((header) => {
            headerData[header].push(row[header]);
          });
          rowCount++;
        } else {
          stream.unpipe(parser);
          parser.end();
        }
      });

      parser.on('end', () => {
        const result = headers.map((header) => ({
          header,
          sampleData: headerData[header],
        }));
        resolve(result);
      });

      parser.on('error', (error) => {
        console.error('Error parsing CSV:', error);
        reject(error);
      });

      stream.pipe(parser);
    });
  }

  private async parseCSV(
    buffer: Buffer,
    { mappedHeaders }: MappedHeadersDto,
  ): Promise<Record<string, any>[]> {
    const stream = Readable.from(buffer);
    return new Promise((resolve, reject) => {
      const records = [];
      stream
        .pipe(csvParser())
        .on('data', (row) => {
          const mappedRow = {};
          Object.keys(mappedHeaders).forEach((header) => {
            if (mappedHeaders[header] !== '') {
              mappedRow[mappedHeaders[header]] = row[header];
            }
          });
          records.push(mappedRow);
        })
        .on('end', () => {
          resolve(records);
        })
        .on('error', reject);
    });
  }
}
