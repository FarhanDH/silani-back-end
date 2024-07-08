import {
  ForbiddenException,
  HttpException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { and, desc, eq } from 'drizzle-orm';
import { DrizzleService } from '~/common/drizzle/drizzle.service';
import {
  fields,
  plantingActivities,
  Reminder,
  reminders,
} from '~/common/drizzle/schema';
import { AuthJWTPayload } from '../models/auth.model';
import {
  CreateReminderRequest,
  ReminderResponse,
  toReminderResponse,
  UpdateReminderRequest,
} from '../models/reminder.model';
import { PlantingActivitiesService } from '../planting-activities/planting-activities.service';

@Injectable()
export class RemindersService {
  constructor(
    private readonly drizzleService: DrizzleService,
    private readonly plantingActivitiesService: PlantingActivitiesService,
  ) {}
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

    // is planting activity exists and is owned by the user
    const isOwnerOfThePlantingActivity =
      await this.plantingActivitiesService.isOwner(
        createReminderRequest.plantingActivityId,
        user.user_uuid,
      );
    if (!isOwnerOfThePlantingActivity) {
      throw new ForbiddenException(
        'You are not the owner of this planting activity !',
      );
    }
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

  async getOneById(user: AuthJWTPayload, id: string) {
    this.logger.debug(
      `RemindersService.getOneById(\nReminder Id: ${id}),\nUser: ${JSON.stringify(user)}`,
    );
    const isReminderExistById = await this.checkById(id);
    await this.isOwner(id, user.user_uuid); // is reminder owner
    try {
      // const isReminderOwner = await this.
      return toReminderResponse(isReminderExistById);
    } catch (error) {
      this.logger.error(`RemindersService.getOneById(): ${error}`);
      throw new HttpException(error, 500);
    }
  }

  async updateById(
    user: AuthJWTPayload,
    id: string,
    updateReminderRequest: UpdateReminderRequest,
  ): Promise<ReminderResponse> {
    this.logger.debug(
      `RemindersService.updateById(\nReminder Id: ${id},\nUser: ${JSON.stringify(user)},\nupdateReminderRequest: ${JSON.stringify(updateReminderRequest)}\n)`,
    );

    if (updateReminderRequest.dateRemind) {
      updateReminderRequest.dateRemind = new Date(
        updateReminderRequest.dateRemind,
      );
    }
    await this.checkById(id); // is reminder exist
    await this.isOwner(id, user.user_uuid); // is reminder owner
    if (updateReminderRequest.plantingActivityId) {
      const isOwnerOfThePlantingActivity =
        await this.plantingActivitiesService.isOwner(
          updateReminderRequest.plantingActivityId,
          user.user_uuid,
        );
      if (!isOwnerOfThePlantingActivity) {
        throw new ForbiddenException(
          'You are not the owner of this planting activity !',
        );
      }
    }
    try {
      const [updatedReminder] = await this.drizzleService.db
        .update(reminders)
        .set({
          ...updateReminderRequest,
        })
        .where(eq(reminders.id, id))
        .returning();
      return toReminderResponse(updatedReminder);
    } catch (error) {
      this.logger.error(`RemindersService.updateById(): ${error}`);
      throw new HttpException(error, 500);
    }
  }

  async deleteById(
    user: AuthJWTPayload,
    id: string,
  ): Promise<ReminderResponse> {
    this.logger.debug(
      `RemindersService.deleteById(\nReminder Id: ${id},\nUser: ${JSON.stringify(user)})\n`,
    );
    await this.checkById(id);
    await this.isOwner(id, user.user_uuid); // is reminder owner
    try {
      const [deletedReminder] = await this.drizzleService.db
        .delete(reminders)
        .where(eq(reminders.id, id))
        .returning();
      return toReminderResponse(deletedReminder);
    } catch (error) {
      this.logger.error(`RemindersService.deleteById(): ${error}`);
      throw new HttpException(error, 500);
    }
  }

  async checkById(reminderId: string): Promise<Reminder> {
    const [result] = await this.drizzleService.db
      .select()
      .from(reminders)
      .where(eq(reminders.id, reminderId));

    if (!result) {
      this.logger.error(`Reminder with id ${reminderId} not found`);
      throw new NotFoundException(`Reminder with id ${reminderId} not found`);
    }
    return result;
  }

  async isOwner(reminderId: string, userId: string): Promise<boolean> {
    const result = await this.drizzleService.db
      .select()
      .from(reminders)
      .leftJoin(
        plantingActivities,
        eq(reminders.plantingActivityId, plantingActivities.id),
      )
      .leftJoin(fields, eq(plantingActivities.fieldId, fields.id))
      .where(and(eq(fields.userId, userId), eq(reminders.id, reminderId)));

    if (result.length == 0) {
      this.logger.error(`Your are not the owner of this reminder !`);
      throw new ForbiddenException(`Your are not the owner of this reminder !`);
    }

    return result.length > 0;
  }
}
