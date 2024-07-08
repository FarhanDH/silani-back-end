import { HttpException, Injectable, Logger } from '@nestjs/common';
import {
  CreateReminderRequest,
  ReminderResponse,
  toReminderResponse,
  UpdateReminderRequest,
} from '../models/reminder.model';
import { DrizzleService } from '~/common/drizzle/drizzle.service';
import { reminders } from '~/common/drizzle/schema';
import { AuthJWTPayload } from '../models/auth.model';

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

  getAll() {
    return `This action returns all reminders`;
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
