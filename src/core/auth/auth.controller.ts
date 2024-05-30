import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(): Promise<void> {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: any) {
    await this.usersService.signInUserFromGoogle(req.user);
    return await this.authService.loginuser(req.user);
  }
}
