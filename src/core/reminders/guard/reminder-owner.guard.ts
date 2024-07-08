import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { RequestWithUser } from '~/common/utils';
import { PlantingActivitiesService } from '~/core/planting-activities/planting-activities.service';
import { RemindersService } from '../reminders.service';

@Injectable()
export class ReminderOwnerGuard implements CanActivate {
  constructor(
    private readonly plantingActivitiesService: PlantingActivitiesService,
    private readonly remindersService: RemindersService,
  ) {}
  private readonly logger: Logger = new Logger(ReminderOwnerGuard.name);

  /**
   * Check if the user is the owner of the planting activity by body.
   *
   * @return {Promise<boolean>} A promise that resolves to a boolean indicating if the user is the owner of the planting activity.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: RequestWithUser = context.switchToHttp().getRequest();
    const requestingUserid = request.user.user_uuid;
    const requestPlantingActivityId = request.body.plantingActivityId;
    const requestReminderId = request.params.id;

    if (requestReminderId && requestPlantingActivityId) {
      const isReminderOwner = await Promise.all([
        this.remindersService.isOwner(requestReminderId, requestingUserid),
        this.plantingActivitiesService.isOwner(
          requestPlantingActivityId,
          requestingUserid,
        ),
      ]);

      if (!isReminderOwner[0]) {
        this.logger.error('You are not the owner of this reminder !');
        throw new ForbiddenException(
          'You are not the owner of this reminder !',
        );
      }
      if (!isReminderOwner[1]) {
        this.logger.error('You are not the owner of this planting activity !');
        throw new ForbiddenException(
          'You are not the owner of this planting activity !',
        );
      }
      return true;
    }

    if (requestReminderId) {
      const isReminderOwner = await this.remindersService.isOwner(
        requestReminderId,
        requestingUserid,
      );
      if (!isReminderOwner) {
        this.logger.error('You are not the owner of this reminder !');
        throw new ForbiddenException(
          'You are not the owner of this reminder !',
        );
      }
      return true;
    }

    const isPlantingActivityExist =
      await this.plantingActivitiesService.isOwner(
        requestPlantingActivityId,
        requestingUserid,
      );
    if (!isPlantingActivityExist) {
      this.logger.error('You are not the owner of this planting activity !');
      throw new ForbiddenException(
        'You are not the owner of this planting activity !',
      );
    }
    return true;
  }
}
