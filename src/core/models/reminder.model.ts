import { PartialType } from '@nestjs/mapped-types';
import { IsDateString, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { Reminder } from '~/common/drizzle/schema/reminders';

export class CreateReminderRequest {
  @IsNotEmpty()
  @IsUUID()
  plantingActivityId: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsDateString()
  dateRemind: Date;
}

export class UpdateReminderRequest extends PartialType(CreateReminderRequest) {}

export class ReminderResponse {
  id: string;
  plantingActivityId: string;
  title: string;
  dateRemind: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const toReminderResponse = (reminder: Reminder): ReminderResponse => {
  return {
    id: reminder.id,
    plantingActivityId: reminder.plantingActivityId,
    title: reminder.title,
    dateRemind: reminder.dateRemind,
    createdAt: reminder.createdAt,
    updatedAt: reminder.updatedAt,
  };
};
