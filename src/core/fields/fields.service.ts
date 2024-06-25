import {
  HttpException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { DrizzleService } from '~/common/drizzle/drizzle.service';
import { fields } from '~/common/drizzle/schema';
import { uniqueKeyFile } from '~/common/utils';
import {
  CreateFieldRequest,
  FieldResponse,
  toFieldResponse,
} from '../models/field.model';
import { StorageService } from '../storage/storage.service';
import { UsersService } from '../users/users.service';
import * as fs from 'fs';

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
    user: any,
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

  async getAll(user: any): Promise<FieldResponse[]> {
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

  findOne(id: number) {
    return `This action returns a #${id} field`;
  }

  remove(id: number) {
    return `This action removes a #${id} field`;
  }
}
