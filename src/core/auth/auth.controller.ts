import { Body, Controller, Post } from '@nestjs/common';
import { Response } from '../models/response.model';
import {
  GoogleUserRequest,
  RegisterUserRequest,
  UserResponse,
} from '../models/user.model';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  async registerUser(
    @Body() registerRequest: RegisterUserRequest,
  ): Promise<Response<UserResponse>> {
    const result = await this.usersService.registerUser(registerRequest);
    return {
      message: 'User registered successfully',
      data: result,
    };
  }

  @Post('google')
  async googleUser(
    @Body() googleUserRequest: GoogleUserRequest,
  ): Promise<Response<UserResponse>> {
    const result = await this.usersService.googleUser(googleUserRequest);
    return {
      message: 'User logged in successfully',
      data: result,
    };
  }
}
