import {
  HttpException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { DrizzleService } from '~/common/drizzle/drizzle.service';
import { FieldPest, fieldPests, fields } from '~/common/drizzle/schema';
import { Validation } from '~/common/validation';
import { AuthJWTPayload } from '../models/auth.model';
import {
  CreateFieldPestRequest,
  FieldPestResponse,
  UpdateFieldPestRequest,
  toFieldPestResponse,
} from '../models/field-pest.model';

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

  async getAll(user: AuthJWTPayload): Promise<FieldPestResponse[]> {
    this.logger.debug(
      `FieldPestsService.getAll(), user: ${JSON.stringify(user)}`,
    );
    try {
      const result = await this.drizzleService.db
        .select()
        .from(fieldPests)
        .leftJoin(fields, eq(fieldPests.fieldId, fields.id))
        .where(eq(fields.userId, user.user_uuid));
      return result.map((el) => toFieldPestResponse(el.field_pests));
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error, 500);
    }
  }

  async getOneById(
    id: string,
    user: AuthJWTPayload,
  ): Promise<FieldPestResponse> {
    this.logger.debug(
      `FieldPestsService.getOneById(${id}), user: ${JSON.stringify(user)}`,
    );
    try {
      const result = await this.drizzleService.db
        .select()
        .from(fieldPests)
        .where(eq(fieldPests.id, id))
        .leftJoin(fields, eq(fieldPests.fieldId, fields.id));
      // .where(eq(fields.userId, user.user_uuid));
      return toFieldPestResponse(result[0].field_pests);
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error, 500);
    }
  }

  async updateById(
    id: string,
    user: AuthJWTPayload,
    updateFieldPestRequest: UpdateFieldPestRequest,
  ): Promise<FieldPestResponse> {
    this.logger.debug(
      `FieldPestsService.updateById(${id}, ${JSON.stringify(updateFieldPestRequest)}), user: ${JSON.stringify(user)}`,
    );
    try {
      await this.checkById(id, user.user_uuid);
      const [result] = await this.drizzleService.db
        .update(fieldPests)
        .set({ ...updateFieldPestRequest, updatedAt: new Date() })
        .where(eq(fieldPests.id, id))
        .returning();
      return toFieldPestResponse(result);
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error, 500);
    }
  }

  async deletById(
    id: string,
    user: AuthJWTPayload,
  ): Promise<FieldPestResponse> {
    this.logger.debug(
      `FieldPestsService.deletById(${id}), user: ${JSON.stringify(user)}`,
    );
    try {
      await this.checkById(id, user.user_uuid);
      const [result] = await this.drizzleService.db
        .delete(fieldPests)
        .where(eq(fieldPests.id, id))
        .returning();
      return toFieldPestResponse(result);
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error, 500);
    }
  }

  async checkById(fieldPestId: string, userId: string): Promise<FieldPest> {
    // is id is correct pattern
    Validation.uuid(fieldPestId);

    const result = await this.drizzleService.db
      .select()
      .from(fieldPests)
      .leftJoin(fields, eq(fieldPests.fieldId, fields.id))
      .where(and(eq(fields.userId, userId), eq(fieldPests.id, fieldPestId)));

    if (result.length == 0) {
      this.logger.error(
        `FieldPestsService.checkById(${fieldPestId}), user: ${userId}`,
      );
      throw new NotFoundException(`FieldPest with id ${fieldPestId} not found`);
    }
    return result[0].field_pests;
  }

  async isOwner(fieldPestId: string, userId: string): Promise<boolean> {
    // is id is correct pattern
    Validation.uuid(fieldPestId);

    const result = await this.drizzleService.db
      .select()
      .from(fieldPests)
      .leftJoin(fields, eq(fieldPests.fieldId, fields.id))
      .where(and(eq(fields.userId, userId), eq(fieldPests.id, fieldPestId)));

    return result.map((el) => toFieldPestResponse(el.field_pests)).length > 0;
  }
}
