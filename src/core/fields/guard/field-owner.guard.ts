import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { RequestWithUser } from '~/common/utils';
import { FieldsService } from '../fields.service';

@Injectable()
export class FieldOwnerGuard implements CanActivate {
  constructor(private readonly fieldsService: FieldsService) {}
  private readonly logger: Logger = new Logger(FieldOwnerGuard.name);

  /**
   * Check if the user is the owner of the comment.
   *
   * @return {Promise<boolean>} A promise that resolves to a boolean indicating if the user is the owner of the comment.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: RequestWithUser = context.switchToHttp().getRequest();
    const requestingUserid = request.user;
    const requestFieldId = request.params.id;

    const isFieldOwner = await this.fieldsService.isOwner(
      requestFieldId,
      requestingUserid.user_uuid,
    );
    if (!isFieldOwner) {
      this.logger.error('You are not the owner of this field!');
      throw new ForbiddenException('You are not the owner of this field!');
    }
    return true;
  }
}
