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

@Injectable()
export class JwtGuard implements CanActivate {
  private readonly logger: Logger = new Logger(JwtGuard.name);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

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
      request['user'] = payload;
    } catch (e) {
      this.logger.error(e);
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request) {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
