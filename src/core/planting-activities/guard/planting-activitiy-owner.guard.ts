import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { RequestWithUser } from '~/common/utils';
import { PlantingActivitiesService } from '../planting-activities.service';

@Injectable()
export class PlantingActivityOwnerGuard implements CanActivate {
  constructor(
    private readonly plantingActivitiesService: PlantingActivitiesService,
  ) {}
  private readonly logger: Logger = new Logger(PlantingActivityOwnerGuard.name);

  /**
   * Check if the user is the owner of the field.
   *
   * @return {Promise<boolean>} A promise that resolves to a boolean indicating if the user is the owner of the field.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: RequestWithUser = context.switchToHttp().getRequest();
    const requestingUserid = request.user.user_uuid;
    const requestPlantingActivityId = request.params.id;

    const isPlantingActivityExist =
      await this.plantingActivitiesService.isOwner(
        requestPlantingActivityId,
        requestingUserid,
      );
    if (!isPlantingActivityExist) {
      this.logger.error('You are not the owner of this field pest!');
      throw new ForbiddenException('You are not the owner of this field pest!');
    }
    return true;
  }
}
