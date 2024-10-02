import { BadRequestException, Injectable } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Injectable()
export class DocumentUploadInterceptor {
  createInterceptor(
    fieldName: string,
    allowedMimeTypes: string[],
    message?: string | null,
    fileSizeLimit = 0,
  ) {
    return FileInterceptor(fieldName, {
      fileFilter: (req, file, callback) => {
        if (!allowedMimeTypes.includes(file.mimetype)) {
          return callback(
            new BadRequestException(
              message ||
                `Please use valid file types: "${allowedMimeTypes.join(
                  ', ',
                )}".`,
            ),
            false,
          );
        }
        callback(null, true);
      },
      ...(fileSizeLimit && { limits: { fileSize: fileSizeLimit } }),
    });
  }
}
