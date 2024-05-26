import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable, Logger } from '@nestjs/common';
import { config } from '~/common/config';

@Injectable()
export class StorageService {
  private readonly s3Client = new S3Client({
    region: config().storage.region,
    credentials: {
      accessKeyId: config().storage.accessKeyId,
      secretAccessKey: config().storage.secretAccessKey,
    },
  });
  private readonly logger: Logger = new Logger(StorageService.name);

  async upload(key: string, body: Buffer, mimeType: string) {
    const upload = new PutObjectCommand({
      Bucket: config().storage.bucket,
      Key: key,
      Body: body,
      ContentType: mimeType,
    });

    try {
      const response = await this.s3Client.send(upload);
      const url: string = this.getUrlFromStorage(key);
      this.logger.debug(
        `StorageService.upload(${key}) to storage ${config().storage.bucket}`,
      );
      return {
        statusCode: response.$metadata.httpStatusCode,
        url,
      };
    } catch (error) {
      const errorObject = new Error(
        `Failed to upload object ${key} from storage ${config().storage.bucket}`,
      );
      errorObject.name = error.name;
      errorObject.stack = error.stack;
      this.logger.error(`StorageService.upload(${key}), ${errorObject}`);
      throw errorObject;
    }
  }

  /**
   * Generates a public URL for an object stored in the configured storage.
   *
   * @param key - The key or path of the object in the storage.
   * @returns The public URL for the object.
   */
  getUrlFromStorage(key: string) {
    const url = `https://${config().storage.bucket}.s3.${config().storage.region}.amazonaws.com/${key}`;
    return url;
  }

  /**
   * Deletes an object from the configured S3 bucket.
   *
   * @param key - The key of the object to delete.
   * @returns An object with a `statusCode` property indicating the success of the operation.
   * @throws An error message if the delete operation fails.
   */
  async delete(key: string) {
    const deleteParams = {
      Bucket: config().storage.bucket,
      Key: key,
    };

    const deleteCommand = new DeleteObjectCommand(deleteParams);

    try {
      await this.s3Client.send(deleteCommand);
      this.logger.debug(
        `StorageService.delete(${key}) from storage ${config().storage.bucket}`,
      );
      return {
        statusCode: 200,
      };
    } catch (error) {
      const errorObject = new Error(
        `Failed to delete object ${key} from storage ${config().storage.bucket}`,
      );
      errorObject.name = error.name;
      errorObject.stack = error.stack;
      this.logger.error(`StorageService.delete(${key}), ${errorObject}`);
      throw errorObject;
    }
  }
}
