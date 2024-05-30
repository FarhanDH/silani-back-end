import { Injectable, Logger } from '@nestjs/common';
import { DrizzleService } from '~/common/drizzle/drizzle.service';
import { users } from '~/common/drizzle/schema';
import { SignInGoogleDto } from './dto/signIn-google.dto';

@Injectable()
export class UsersService {
  constructor(private readonly drizzleService: DrizzleService) {}
  private readonly logger: Logger = new Logger(UsersService.name);

  async signInUserFromGoogle(signInGoogleDto: SignInGoogleDto) {
    const isUserExists = await this.findByEmail(signInGoogleDto.email);
    if (isUserExists) {
      this.logger.warn(`User google ${signInGoogleDto.email} already exists`);
      return;
    }

    return this.drizzleService.db
      .insert(users)
      .values({
        ...signInGoogleDto,
      })
      .returning({ id: users.id, email: users.email });
  }

  async findByEmail(email: string) {
    return await this.drizzleService.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });
  }
}
