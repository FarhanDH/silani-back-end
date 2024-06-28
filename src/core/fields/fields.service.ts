import {
  HttpException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { DrizzleService } from '~/common/drizzle/drizzle.service';
import { Field, fields } from '~/common/drizzle/schema';
import { uniqueKeyFile } from '~/common/utils';
import {
  CreateFieldRequest,
  FieldResponse,
  UpdateFieldRequest,
  toFieldResponse,
} from '../models/field.model';
import { StorageService } from '../storage/storage.service';
import { UsersService } from '../users/users.service';
import * as fs from 'fs';
import { Validation } from '~/common/validation';
import { and, eq } from 'drizzle-orm';
import { AuthJWTPayload } from '../models/auth.model';

@Injectable()
export class FieldsService {
  constructor(
    private readonly drizzleService: DrizzleService,
    private readonly storageService: StorageService,
    private readonly usersService: UsersService,
  ) {}
  private readonly logger: Logger = new Logger(FieldsService.name);

  async create(
    createFieldRequest: CreateFieldRequest,
    user: AuthJWTPayload,
    image?: Express.Multer.File,
  ): Promise<FieldResponse> {
    this.logger.debug(
      `FieldsService.create(User ${JSON.stringify(user)} creating field ${JSON.stringify(createFieldRequest)}, with image ${JSON.stringify(image)})`,
    );

    // check is user exist by email, throw exception if not found
    const isUserExist = await this.usersService.findByEmail(user.user_email);
    if (!isUserExist) {
      this.logger.error(`User ${user.user_email} not found`);
      throw new NotFoundException(`User ${user.user_email} not found`);
    }

    if (!image) {
      const fileData = fs.readFileSync('./seeds/image/field/field.jpeg');
      image = {
        fieldname: 'image',
        originalname: 'field.jpeg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        buffer: fileData,
        size: fileData.length,
      } as Express.Multer.File;
    }

    const generateUniqueKeyFileName = uniqueKeyFile(
      'field',
      image.originalname,
    );
    try {
      const uploadedImage = await this.storageService.upload(
        generateUniqueKeyFileName,
        image.buffer,
        image.mimetype,
      );

      const [createdField] = await this.drizzleService.db
        .insert(fields)
        .values({
          userId: isUserExist.id,
          ...createFieldRequest,
          imageUrl: uploadedImage.url,
          imageKey: generateUniqueKeyFileName,
        })
        .returning();

      return toFieldResponse(createdField);
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error, 500);
    }
  }

  async getAll(user: AuthJWTPayload): Promise<FieldResponse[]> {
    // check is user exist by email, throw exception if not found
    const isUserExist = await this.usersService.findByEmail(user.user_email);
    if (!isUserExist) {
      this.logger.error(`User ${user.user_email} not found`);
      throw new NotFoundException(`User ${user.user_email} not found`);
    }

    const fields = await this.drizzleService.db.query.fields.findMany({
      where: (field, { eq }) => eq(field.userId, isUserExist.id),
    });

    return fields.map((field) => toFieldResponse(field));
  }

  async getOneById(
    fieldId: string,
    user: AuthJWTPayload,
  ): Promise<FieldResponse> {
    const field = await this.checkFieldById(fieldId, user.user_uuid);
    return toFieldResponse(field);
  }

  async updateById(
    fieldId: string,
    updateFieldRequest: UpdateFieldRequest,
    user: AuthJWTPayload,
    image?: Express.Multer.File,
  ): Promise<FieldResponse> {
    this.logger.debug(
      `FieldsService.updateById(User ${JSON.stringify(user)} updating field ${JSON.stringify(updateFieldRequest)}, with image ${JSON.stringify(image)})`,
    );

    // is field exist by id
    const isFieldExistById = await this.checkFieldById(fieldId, user.user_uuid);

    if (image) {
      const generateUniqueKeyFileName = uniqueKeyFile(
        'field',
        image.originalname,
      );
      try {
        const imageUploded = await this.storageService.upload(
          generateUniqueKeyFileName,
          image.buffer,
          image.mimetype,
        );

        // update database, get updated field, delete existing image from storage
        const [[updatedField]] = await Promise.all([
          this.drizzleService.db
            .update(fields)
            .set({
              ...updateFieldRequest,
              imageUrl: imageUploded.url,
              imageKey: generateUniqueKeyFileName,
              updatedAt: new Date(),
            })
            .where(eq(fields.id, fieldId))
            .returning(),
          this.storageService.delete(isFieldExistById.imageKey),
        ]);

        // response updated plant from database
        return toFieldResponse(updatedField);
      } catch (error) {
        this.logger.error(error);
        throw new HttpException(error, 500);
      }
    }

    // handle if image not provided
    try {
      // update database, get updated field, delete existing image from storage
      const [updatedField] = await this.drizzleService.db
        .update(fields)
        .set({
          ...updateFieldRequest,
          updatedAt: new Date(),
        })
        .where(eq(fields.id, fieldId))
        .returning();

      // response updated plant from database
      return toFieldResponse(updatedField);
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error, 500);
    }
  }

  async deleteById(
    fieldId: string,
    user: AuthJWTPayload,
  ): Promise<FieldResponse> {
    const isFieldExistById = await this.checkFieldById(fieldId, user.user_uuid);
    try {
      const [[deletedField]] = await Promise.all([
        this.drizzleService.db
          .delete(fields)
          .where(eq(fields.id, fieldId) && eq(fields.userId, user.user_uuid))
          .returning(),
        this.storageService.delete(isFieldExistById.imageKey),
      ]);

      return toFieldResponse(deletedField);
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error, 500);
    }
  }

  async checkFieldById(fieldId: string, userId: string): Promise<Field> {
    // is id is correct pattern
    Validation.uuid(fieldId);

    const fields = await this.drizzleService.db.query.fields.findFirst({
      where: (field, { eq }) =>
        and(eq(field.id, fieldId), eq(field.userId, userId)),
    });

    if (!fields) {
      this.logger.error(`Field ${fieldId} not found`);
      throw new NotFoundException(`Field ${fieldId} not found`);
    }
    return fields;
  }

  async isOwner(fieldId: string, userId: string): Promise<boolean> {
    // is id is correct pattern
    Validation.uuid(fieldId);

    const isFieldExistById =
      await this.drizzleService.db.query.fields.findFirst({
        where: (field, { eq }) =>
          and(eq(field.id, fieldId), eq(field.userId, userId)),
      });

    return isFieldExistById?.userId === userId;
  }
}
