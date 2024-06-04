import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { config } from '~/common/config';
import { UsersService } from '../users/users.service';

const EXPIRE_TIME = 1000 * 60 * 60 * 24 * 365;

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private readonly logger: Logger = new Logger(AuthService.name);

  async generateToken(user: any) {
    const payload = {
      id: user.id,
      email: user.email,
      sub: {
        name: user.fullName,
      },
    };

    return {
      user,
      token: {
        accessToken: await this.jwtService.signAsync(payload, {
          expiresIn: '365d',
          secret: config().jwt.secret,
        }),
        expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
      },
    };
  }

  // async validateUser(
  //   loginUserRequest: LoginUserRequest,
  // ): Promise<any | undefined> {
  //   this.logger.debug(`validateUser: ${JSON.stringify(loginUserRequest)}`);
  //   const user = await this.usersService.findByEmail(loginUserRequest.email);

  //   // check if user and password exist
  //   if (
  //     user &&
  //     loginUserRequest.password &&
  //     (await compare(loginUserRequest.password, user.password as string))
  //   ) {
  //     // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //     const { password: _, ...result } = user;
  //     return result;
  //   }

  //   // if user not contain password
  //   if (user) {
  //     // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //     const { password: _, ...result } = user;
  //     return result;
  //   }
  //   throw new UnauthorizedException('Invalid credentials');
  // }
}
