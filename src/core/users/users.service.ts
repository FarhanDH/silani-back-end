import {
  ConflictException,
  Inject,
  Injectable,
  Logger,
  forwardRef,
} from '@nestjs/common';
import { hash } from 'bcrypt';
import { DrizzleService } from '~/common/drizzle/drizzle.service';
import { users } from '~/common/drizzle/schema';
import {
  GoogleUserRequest,
  RegisterUserRequest,
  UserResponse,
} from '../models/user.model';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly drizzleService: DrizzleService,
  ) {}
  private readonly logger: Logger = new Logger(UsersService.name);

  async registerUser(
    registerRequest: RegisterUserRequest,
  ): Promise<UserResponse> {
    this.logger.debug(
      `UsersService.registerUser(${JSON.stringify(registerRequest)})`,
    );

    // is user already exist by email
    const isUserExists = await this.findByEmail(registerRequest.email);
    if (isUserExists) {
      this.logger.warn(`User ${registerRequest.email} already exists`);
      throw new ConflictException(
        `User ${registerRequest.email} already exists`,
      );
    }

    const createdUser = await this.drizzleService.db
      .insert(users)
      .values({
        ...registerRequest,
        avatarUrl: `https://ui-avatars.com/api/?name=${registerRequest.fullName}`,
        password: await hash(registerRequest.password, 10),
      })
      .returning({
        id: users.id,
        email: users.email,
        fullName: users.fullName,
        avatarUrl: users.avatarUrl,
        dateOfBirth: users.dateOfBirth,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      });

    return createdUser[0];
  }

  async googleUser(
    googleUserRequest: GoogleUserRequest,
  ): Promise<UserResponse> {
    this.logger.debug(
      `UsersService.googleUser(${JSON.stringify(googleUserRequest)})`,
    );
    const isUserExists = await this.findByEmail(googleUserRequest.email);
    if (isUserExists && isUserExists.googleId) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, facebookId, ...result } = isUserExists;
      const user = await this.authService.generateToken(result);
      return {
        ...user.user,
        token: user.token,
      };
    }

    if (isUserExists) {
      this.logger.warn(`User ${googleUserRequest.email} already exists`);
      throw new ConflictException(
        `User ${googleUserRequest.email} already exists`,
      );
    }

    const createdUser = await this.drizzleService.db
      .insert(users)
      .values({
        ...googleUserRequest,
        avatarUrl:
          googleUserRequest.avatarUrl ||
          `https://ui-avatars.com/api/?name=${googleUserRequest.fullName}`,
      })
      .returning({
        id: users.id,
        fullName: users.fullName,
        email: users.email,
        avatarUrl: users.avatarUrl,
        dateOfBirth: users.dateOfBirth,
        googleId: users.googleId,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      });

    const user = await this.authService.generateToken(createdUser[0]);
    return {
      ...user.user,
      token: user.token,
    };
  }

  async findByEmail(email: string) {
    return await this.drizzleService.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });
  }
}
