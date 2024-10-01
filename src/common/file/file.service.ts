import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClientManager } from '../database/prisma-client-manager';
import { AppUtilities } from '../utils/app.utilities';
// import { CreateFileDto } from './dto/create-file.dto';
import { UploadFileDto } from './dto/upload-file.dto';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';

@Injectable()
export class FileService {
  private s3Sdk: S3Client;
  private S3Region: string;
  private S3Key: string;
  private S3Secret: string;
  private S3Bucket: string;

  constructor(
    private configService: ConfigService,
    private prismaClientManager: PrismaClientManager,
  ) {
    this.S3Region = this.configService.get<string>('aws.S3Region');
    this.S3Key = this.configService.get<string>('aws.S3Key');
    this.S3Secret = this.configService.get<string>('aws.S3Secret');
    this.S3Bucket = this.configService.get<string>('aws.S3Bucket');

    this.s3Sdk = new S3Client({
      credentials: {
        accessKeyId: this.S3Key,
        secretAccessKey: this.S3Secret,
      },
      region: this.S3Region,
    });
  }

  async uploadFile(data: UploadFileDto) {
    // const {} = await createPresignedPost(this.s3Sdk, {
    //   Bucket: this.S3Bucket,
    //   Key: AppUtilities.generateShortCode(),
    // });

    const command = new PutObjectCommand({
      Bucket: this.S3Bucket,
      Key: AppUtilities.generateShortCode(),
      Body: data.imageBuffer,
      ACL: data.privacy,
    });

    const uploadResult = await this.s3Sdk.send(command);

    if (uploadResult.$metadata.httpStatusCode !== 200) {
      throw new UnprocessableEntityException('Failed to upload file');
    }

    return uploadResult;
  }

  //   async createCompanyFile(companyId: string, data: CreateFileDto) {
  //     const uploadResult = await this.uploadFile(data);

  //     const prisma = this.prismaClientManager.getCompanyPrismaClient(companyId);

  //     return await prisma.file.create({
  //       data: {
  //         url: uploadResult.Location,
  //         key: uploadResult.Key,
  //         eTag: uploadResult.ETag,
  //         bucket: uploadResult.Bucket,
  //         name: data.name,
  //       },
  //     });
  //   }

  public async generatePresignedUrl(key: string) {
    const { url, fields } = await createPresignedPost(this.s3Sdk, {
      Bucket: this.S3Bucket,
      Key: key,
    });

    return { url, fields };
  }
}
