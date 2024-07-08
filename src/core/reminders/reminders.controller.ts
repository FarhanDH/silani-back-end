import {
  Body,
  Controller,
  Delete,
  Get,
  NotAcceptableException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard/jwt.guard';
import {
  CreateReminderRequest,
  ReminderResponse,
  UpdateReminderRequest,
} from '../models/reminder.model';
import { Response } from '../models/response.model';
import { ReminderOwnerGuard } from './guard/reminder-owner.guard';
import { RemindersService } from './reminders.service';
import { RequestWithUser } from '~/common/utils';

@Controller('reminders')
export class RemindersController {
  constructor(private readonly remindersService: RemindersService) {}

  @UseGuards(JwtGuard, ReminderOwnerGuard)
  @Post('')
  async create(
    @Request() req: RequestWithUser,
    @Body() createReminderRequest: CreateReminderRequest,
  ): Promise<Response<ReminderResponse>> {
    const result = await this.remindersService.create(
      req.user,
      createReminderRequest,
    );
    return {
      message: 'Reminder created successfully',
      data: result,
    };
  }

  @UseGuards(JwtGuard)
  @Get()
  async getAll(
    @Request() req: RequestWithUser,
  ): Promise<Response<ReminderResponse[]>> {
    const result = await this.remindersService.getAll(req.user);
    return {
      message: 'Reminders retrieved successfully',
      data: result,
    };
  }

  @UseGuards(JwtGuard, ReminderOwnerGuard)
  @Get(':id')
  async getOnById(
    @Request() req: RequestWithUser,
    @Param(
      'id',
      new ParseUUIDPipe({
        exceptionFactory: () => {
          throw new NotAcceptableException('Params must be a valid UUID');
        },
      }),
    )
    id: string,
  ): Promise<Response<ReminderResponse>> {
    const result = await this.remindersService.getOneById(req.user, id);
    return {
      message: 'Reminder retrieved successfully',
      data: result,
    };
  }

  @Patch(':id')
  update(
    @Param(
      'id',
      new ParseUUIDPipe({
        exceptionFactory: () => {
          throw new NotAcceptableException('Params must be a valid UUID');
        },
      }),
    )
    id: string,
    @Body() updateReminderRequest: UpdateReminderRequest,
  ) {
    return this.remindersService.updateById(id, updateReminderRequest);
  }

  @Delete(':id')
  remove(
    @Param(
      'id',
      new ParseUUIDPipe({
        exceptionFactory: () => {
          throw new NotAcceptableException('Params must be a valid UUID');
        },
      }),
    )
    id: string,
  ) {
    return this.remindersService.deleteById(id);
  }
}
