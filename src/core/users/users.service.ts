import { Injectable, Logger } from '@nestjs/common';
import { DrizzleService } from '~/common/drizzle/drizzle.service';
import { users } from '~/common/drizzle/schema';
import { CreateUserDto } from './dto/create-user.dto';
import { hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly drizzleService: DrizzleService) {}
  private readonly logger: Logger = new Logger(UsersService.name);

  async registerUser(createUserDto: CreateUserDto) {
    this.logger.debug(
      `UsersService.registerUser(${JSON.stringify(createUserDto)})`,
    );

    // is user already exist by email
    const isUserExists = await this.findByEmail(createUserDto.email);
    if (isUserExists) {
      this.logger.warn(`User ${createUserDto.email} already exists`);
      return;
    }

    const createdUser = await this.drizzleService.db
      .insert(users)
      .values({
        ...createUserDto,
        avatarUrl: `https://ui-avatars.com/api/?name=${createUserDto.fullName}`,
        password: await hash(createUserDto.password, 10),
      })
      .returning({
        id: users.id,
        fullName: users.fullName,
        email: users.email,
      });

    return createdUser[0];
  }

  async signInUserFromGoogle(createUserDto: CreateUserDto) {
    this.logger.debug(
      `UsersService.signInUserFromGoogle(${JSON.stringify(createUserDto)})`,
    );
    const isUserExists = await this.findByEmail(createUserDto.email);
    if (isUserExists) {
      this.logger.warn(`User google ${createUserDto.email} already exists`);
      return;
    }

    return this.drizzleService.db
      .insert(users)
      .values({
        ...createUserDto,
      })
      .returning({ id: users.id, email: users.email });
  }

  async findByEmail(email: string) {
    return await this.drizzleService.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });
  }
}
