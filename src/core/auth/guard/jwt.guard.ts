import { clerkClient } from '@clerk/clerk-sdk-node';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { config } from '~/common/config';
import { RequestWithUser } from '~/common/utils';
import { AuthJWTPayload } from '~/core/models/auth.model';
import { UsersService } from '~/core/users/users.service';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}
  private readonly logger: Logger = new Logger(JwtGuard.name);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: RequestWithUser = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    this.logger.debug(`JwtGuard.canActivate(${token})`);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await clerkClient.verifyToken(token, {
        secretKey: config().clerk.secretKey,
        authorizedParties: [
          'https://exciting-hawk-78.accounts.dev',
          'http://localhost:3000',
        ], // add front-end url with port
      });

      const isUserExistByEmail = await this.usersService.findByEmail(
        payload.user_email,
      );

      if (!isUserExistByEmail) {
        this.logger.error(`User ${payload.user_email} not found`);
        throw new UnauthorizedException(
          `User ${payload.user_email} not found`,
        ).getResponse();
      }

      request['user'] = {
        ...payload,
        user_uuid: isUserExistByEmail.id,
      } as AuthJWTPayload;
    } catch (e) {
      this.logger.error(e);
      throw new UnauthorizedException(e);
    }
    return true;
  }

  private extractTokenFromHeader(request: Request) {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
