import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { config } from '~/common/config';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { compare } from 'bcrypt';

const EXPIRE_TIME = 1000 * 60 * 60 * 24 * 365;

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private readonly logger: Logger = new Logger(AuthService.name);

  async loginuser(loginDto: LoginDto) {
    this.logger.debug(`loginuser: ${JSON.stringify(loginDto)}`);
    const user = await this.validateUser(loginDto);
    // check if user contain password
    if (loginDto.password) {
      const userData = await this.generateToken(user);
      delete userData.user.googleId;
      delete userData.user.facebookId;
      return userData;
    }

    // if user not contain password, check if user is google user
    if (!loginDto.password && loginDto.googleId === user?.googleId) {
      const userData = await this.generateToken(user);

      // remove facebookId field from userData
      delete userData.user.facebookId;
      return userData;
    }
  }

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
      backendTokens: {
        accessToken: await this.jwtService.signAsync(payload, {
          expiresIn: '365d',
          secret: config().jwt.secret,
        }),
        expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
      },
    };
  }

  async validateUser(loginDto: LoginDto) {
    this.logger.debug(`validateUser: ${JSON.stringify(loginDto)}`);
    const user = await this.usersService.findByEmail(loginDto.email);

    // check if user and password exist
    if (
      user &&
      loginDto.password &&
      (await compare(loginDto.password, user.password as string))
    ) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...result } = user;
      return result;
    }

    // if user not contain password
    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...result } = user;
      return result;
    }
    throw new UnauthorizedException('Invalid credentials');
  }
}
