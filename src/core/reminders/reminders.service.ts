import { HttpException, Injectable, Logger } from '@nestjs/common';
import { desc, eq } from 'drizzle-orm';
import { DrizzleService } from '~/common/drizzle/drizzle.service';
import { fields, plantingActivities, reminders } from '~/common/drizzle/schema';
import { AuthJWTPayload } from '../models/auth.model';
import {
  CreateReminderRequest,
  ReminderResponse,
  toReminderResponse,
  UpdateReminderRequest,
} from '../models/reminder.model';

@Injectable()
export class RemindersService {
  constructor(private readonly drizzleService: DrizzleService) {}
  private readonly logger: Logger = new Logger(RemindersService.name);

  async create(
    user: AuthJWTPayload,
    createReminderRequest: CreateReminderRequest,
  ): Promise<ReminderResponse> {
    this.logger.debug(
      `RemindersService.create(\nUser: ${JSON.stringify(user)},\ncreateReminderRequest: ${JSON.stringify(createReminderRequest)})`,
    );
    createReminderRequest.dateRemind = new Date(
      createReminderRequest.dateRemind,
    );

    try {
      const [createdReminder] = await this.drizzleService.db
        .insert(reminders)
        .values({
          ...createReminderRequest,
        })
        .returning();

      return toReminderResponse(createdReminder);
    } catch (error) {
      this.logger.error(`RemindersService.create(): ${error}`);
      throw new HttpException(error, 500);
    }
  }

  async getAll(user: AuthJWTPayload): Promise<ReminderResponse[]> {
    this.logger.debug(
      `RemindersService.getAll(\nUser: ${JSON.stringify(user)})`,
    );
    try {
      const result = await this.drizzleService.db
        .select()
        .from(reminders)
        .leftJoin(
          plantingActivities,
          eq(reminders.plantingActivityId, plantingActivities.id),
        )
        .leftJoin(fields, eq(plantingActivities.fieldId, fields.id))
        .where(eq(fields.userId, user.user_uuid))
        .orderBy(desc(reminders.dateRemind));
      return result.map((el) => toReminderResponse(el.reminders));
    } catch (error) {
      this.logger.error(`RemindersService.getAll(): ${error}`);
      throw new HttpException(error, 500);
    }
  }

  getOneById(id: string) {
    return `This action returns a #${id} reminder`;
  }

  updateById(id: string, updateReminderRequest: UpdateReminderRequest) {
    return `This action updates a #${id} reminder`;
  }

  deleteById(id: string) {
    return `This action removes a #${id} reminder`;
  }
}
