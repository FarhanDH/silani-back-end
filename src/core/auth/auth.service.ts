import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';

// const EXPIRE_TIME = 1000 * 60 * 60 * 24 * 365;

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  private readonly logger: Logger = new Logger(AuthService.name);
}
