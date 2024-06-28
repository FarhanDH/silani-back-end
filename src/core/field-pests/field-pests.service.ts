import { HttpException, Injectable, Logger } from '@nestjs/common';
import {
  CreateFieldPestRequest,
  FieldPestResponse,
  UpdateFieldPestRequest,
  toFieldPestResponse,
} from '../models/field-pest.model';
import { DrizzleService } from '~/common/drizzle/drizzle.service';
import { AuthJWTPayload } from '../models/auth.model';
import { fieldPests } from '~/common/drizzle/schema';

@Injectable()
export class FieldPestsService {
  constructor(private readonly drizzleService: DrizzleService) {}
  private readonly logger: Logger = new Logger(FieldPestsService.name);

  async create(
    createFieldPestRequest: CreateFieldPestRequest,
    user: AuthJWTPayload,
  ): Promise<FieldPestResponse> {
    this.logger.debug(
      `FieldPestsService.create(${JSON.stringify(createFieldPestRequest)}), user: ${JSON.stringify(user)}`,
    );

    try {
      const [fieldPest] = await this.drizzleService.db
        .insert(fieldPests)
        .values({
          ...createFieldPestRequest,
        })
        .returning();
      return toFieldPestResponse(fieldPest);
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error, 500);
    }
  }

  findAll() {
    return `This action returns all fieldPests`;
  }

  findOne(id: number) {
    return `This action returns a #${id} fieldPest`;
  }

  update(id: number, updateFieldPestRequest: UpdateFieldPestRequest) {
    return `This action updates a #${id} fieldPest`;
  }

  remove(id: number) {
    return `This action removes a #${id} fieldPest`;
  }
}
