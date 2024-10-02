import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClientManager } from '../database/prisma-client-manager';
import { UploadFileDto } from './dto/upload-file.dto';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { CacheService } from '../cache/cache.service';
import { AppUtilities } from '../utils/app.utilities';
import { CreateFileDto } from './dto/create-file.dto';

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
    private cacheService: CacheService,
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

  async uploadFile(data: UploadFileDto, key: string, filePath = 'public') {
    key = `${filePath}/${key}`;

    const command = new PutObjectCommand({
      Bucket: this.S3Bucket,
      Key: key,
      Body: data.imageBuffer,
    });

    const uploadResult = await this.s3Sdk.send(command);

    if (uploadResult.$metadata.httpStatusCode !== 200) {
      throw new UnprocessableEntityException('Failed to upload file');
    }

    return { eTag: uploadResult.ETag, key };
  }

  async getFile(key: string, expiresIn = 3600) {
    const cachedUrl = await this.cacheService.get(key);

    if (cachedUrl) {
      return cachedUrl;
    }

    const command = new GetObjectCommand({
      Key: key,
      Bucket: this.S3Bucket,
    });

    const url = await getSignedUrl(this.s3Sdk, command, { expiresIn });

    await this.cacheService.set(
      key,
      url,
      AppUtilities.secondsToMilliseconds(expiresIn),
    );

    return url;
  }

  async createCompanyFile(companyId: string, data: CreateFileDto) {
    const uploadResult = await this.uploadFile(data, data.name, 'private');

    const prisma = this.prismaClientManager.getCompanyPrismaClient(companyId);

    return await prisma.file.create({
      data: {
        key: uploadResult.key,
        eTag: uploadResult.eTag,
        bucket: this.S3Bucket,
        name: data.name,
      },
    });
  }

  /**
   *
   * @param key - The key of the file to generate a presigned url for
   * @returns The presigned url for the file along with the fields to use in the form data
   */
  public async generatePresignedUrl(key: string) {
    const { url, fields } = await createPresignedPost(this.s3Sdk, {
      Bucket: this.S3Bucket,
      Key: key,
      Expires: 3600,
    });

    return { url, fields };
  }
}
