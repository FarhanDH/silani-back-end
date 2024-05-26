import { Injectable, Logger } from '@nestjs/common';
import { DrizzleService } from '~/common/drizzle/drizzle.service';
import { pests } from '~/common/drizzle/schema';
import { CreatePestDto } from './dto/create-pest.dto';
import { UpdatePestDto } from './dto/update-pest.dto';
import { eq } from 'drizzle-orm';

@Injectable()
export class PestsService {
  constructor(private readonly drizzleService: DrizzleService) {}
  private readonly logger: Logger = new Logger(PestsService.name);

  async create(createPestDto: CreatePestDto) {
    this.logger.debug(`PestsService.create(${JSON.stringify(createPestDto)})`);
    return await this.drizzleService.db
      .insert(pests)
      .values(createPestDto)
      .returning();
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
}
