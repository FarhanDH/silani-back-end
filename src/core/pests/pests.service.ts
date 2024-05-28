import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { DrizzleService } from '~/common/drizzle/drizzle.service';
import { pests } from '~/common/drizzle/schema';
import { CreatePestDto } from './dto/create-pest.dto';
import { UpdatePestDto } from './dto/update-pest.dto';
import { eq } from 'drizzle-orm';
import { StorageService } from '../storage/storage.service';
import { uniqueKeyFile } from '~/common/utils';

@Injectable()
export class PestsService {
  constructor(
    private readonly drizzleService: DrizzleService,
    private readonly storageService: StorageService,
  ) {}
  private readonly logger: Logger = new Logger(PestsService.name);

  async create(createPestDto: CreatePestDto, image: Express.Multer.File) {
    this.logger.debug(
      `PestsService.create(${JSON.stringify(createPestDto)}, with image ${image.originalname})`,
    );

    // Check if a pest with the same name already exists
    const pestAlreadyExists = await this.findByName(createPestDto.name);
    if (pestAlreadyExists) {
      this.logger.error(`Pest ${createPestDto.name} already exists`);
      throw new ConflictException(`Pest ${createPestDto.name} already exists`);
    }
    try {
      const generateUniqueKeyFileName = uniqueKeyFile(
        'hama',
        image.originalname,
      );
      const imageUploaded = await this.storageService.upload(
        generateUniqueKeyFileName,
        image.buffer,
        image.mimetype,
      );
      return await this.drizzleService.db
        .insert(pests)
        .values({
          ...createPestDto,
          imageUrl: imageUploaded.url,
          imageKey: generateUniqueKeyFileName,
        })
        .returning();
    } catch (error) {
      const errorCreate = new Error(`Failed to create pest`);
      errorCreate.name = error.name;
      errorCreate.stack = error.stack;
      this.logger.error(
        `PestsService.create(${JSON.stringify(createPestDto)}, with image ${image.originalname}), ${errorCreate}`,
      );
      throw errorCreate;
    }
  }

  async getAll() {
    this.logger.debug(`PestsService.getAll()`);
    return await this.drizzleService.db.query.pests.findMany();
  }

  async update(pestId: string, updatePestDto: UpdatePestDto) {
    this.logger.debug(
      `PestsService.update(${pestId}, ${JSON.stringify(updatePestDto)})`,
    );
    return await this.drizzleService.db
      .update(pests)
      .set({ name: updatePestDto.name, updatedAt: new Date() })
      .where(eq(pests.id, pestId))
      .returning()
      .then((data) => data[0]);
  }

  async delete(pestId: string) {
    this.logger.debug(`PestsService.delete(${pestId})`);
    return await this.drizzleService.db
      .delete(pests)
      .where(eq(pests.id, pestId))
      .returning();
  }

  async findByName(name: string) {
    this.logger.debug(`PestsService.findByName(${name})`);
    return await this.drizzleService.db.query.pests.findFirst({
      where: (pests, { eq }) => eq(pests.name, name),
    });
  }
}
