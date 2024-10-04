import { RequestWithUser } from '@@/auth/interfaces';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UploadCsvDto } from './dto/upload-csv.dto';
import * as csvParser from 'csv-parser';
import { FileService } from '@@/common/file/file.service';
import { Readable } from 'stream';
import { MappedHeadersDto } from './dto/mapped-headers.dto';
import { PrismaClient } from '@@prisma/company';
import { AppUtilities } from '@@/common/utils/app.utilities';
import { CompanyUserQueueProducer } from '@@/company/queue/producer';
import { IProcessEmployeeCsvUpload } from '@@/company/interfaces';
import { PrismaClient as BasePrismaClient } from '@prisma/client';

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
      // map headers to be returned
      const headers = await this.parseCsvHeaders(file.buffer);

      // upload file to s3
      const csvKey = `${new Date().getTime()}-csv-${file.originalname.toLowerCase()}`;
      const uploadedFile = await this.fileService.uploadFile(
        { imageBuffer: file.buffer },
        csvKey,
        'private',
      );

      // create a record in the database for the uploaded file
      const fileRecord = await prisma.fileUpload.create({
        data: {
          file: {
            create: {
              name: csvKey,
              key: uploadedFile.key,
              eTag: uploadedFile.eTag,
              createdBy: req?.user?.userId,
            },
          },
        },
      });

      return { headers, uploadId: fileRecord.id };
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
        },
      });

      if (!upload) {
        throw new NotFoundException('Upload not found');
      }

      await prisma.fileUpload.update({
        where: { id: uploadId },
        data: {
          status: 'Processing',
        },
      });

      const uploadedFile = await this.fileService.getFileAsStream(
        upload.file.key,
      );

      const fileBuffer = await AppUtilities.streamToBuffer(uploadedFile);

      const records = await this.parseCSV(fileBuffer, mappedHeaders);

      // map the headers to the records

      // send the records to the queue
      // const company = await this.basePrismaClient.baseCompany.findUnique({
      //   where: {
      //     code: req['company'],
      //   },
      // });

      const data: IProcessEmployeeCsvUpload = {
        records,
        uploadId,
        companyId: '9c109e01-67ab-45a4-b568-f40262b0d5b5',
      };

      this.queueProducer.processEmployeeCsvUpload(data);

      return records;
    });
  }

  private async parseCsvHeaders(buffer: Buffer): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const stream = Readable.from(buffer);

      const parser = csvParser();

      parser.on('headers', (headerList: string[]) => {
        resolve(headerList);
        stream.unpipe(parser);
        parser.end();
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
