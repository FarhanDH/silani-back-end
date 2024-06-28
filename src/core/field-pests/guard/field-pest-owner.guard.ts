import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { RequestWithUser } from '~/common/utils';
import { FieldsService } from '~/core/fields/fields.service';
import { FieldPestsService } from '../field-pests.service';

@Injectable()
export class FieldPestOwnerGuard implements CanActivate {
  constructor(
    private readonly fieldsService: FieldsService,
    private readonly fieldPestsService: FieldPestsService,
  ) {}
  private readonly logger: Logger = new Logger(FieldPestOwnerGuard.name);

  /**
   * Check if the user is the owner of the field.
   *
   * @return {Promise<boolean>} A promise that resolves to a boolean indicating if the user is the owner of the field.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: RequestWithUser = context.switchToHttp().getRequest();
    const requestingUserid = request.user.user_uuid;
    const requestFieldPestId = request.params.id;
    const requestFieldId = request.body.fieldId;

    if (requestFieldId) {
      const isFieldOwner = await this.fieldsService.isOwner(
        requestFieldId,
        requestingUserid,
      );
      if (!isFieldOwner) {
        this.logger.error('You are not the owner of this field!');
        throw new ForbiddenException('You are not the owner of this field!');
      }
      return true;
    }

    const isFieldPestOwner = await this.fieldPestsService.isOwner(
      requestFieldPestId,
      requestingUserid,
    );
    if (!isFieldPestOwner) {
      this.logger.error('You are not the owner of this field pest!');
      throw new ForbiddenException('You are not the owner of this field pest!');
    }
    return true;
  }
}
