import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { config } from '~/common/config';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

const EXPIRE_TIME = 1000 * 60 * 60 * 365;

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async loginuser(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!loginDto.password && loginDto.googleId === user?.googleId) {
      return await this.generateToken(user);
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
}
