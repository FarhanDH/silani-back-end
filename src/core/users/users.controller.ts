import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtGuard } from '../auth/guard/jwt.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtGuard)
  @Get()
  async getUsers(@Req() request: any) {
    return await this.usersService.getUsers(request.user);
  }
}
