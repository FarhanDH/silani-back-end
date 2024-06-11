import {
  Body,
  Controller,
  Get,
  ParseFilePipeBuilder,
  Post,
  Request,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AiChatService } from './ai-chat.service';
import { AIChatResponse, CreateAIChatRequest } from '../models/ai-chat.model';
import { Response } from '../models/response.model';
import { JwtGuard } from '../auth/guard/jwt.guard';

@Controller('ai-chat')
export class AiChatController {
  constructor(private readonly aiChatService: AiChatService) {}

  @UseGuards(JwtGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() prompt: CreateAIChatRequest,
    @Request() req: any,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png|svg|tiff|webp)$/,
        })
        .addMaxSizeValidator({ maxSize: 1000000 })
        .build({ fileIsRequired: false }),
    )
    image?: Express.Multer.File,
  ): Promise<Response<AIChatResponse>> {
    const isImageExist = image ? image : false;

    if (isImageExist) {
      const result = await this.aiChatService.geminiAI(
        req.user,
        prompt,
        isImageExist,
      );
      return {
        message: 'AI chat sent successfully',
        data: result,
      };
    }
    const result = await this.aiChatService.groqAI(req.user, prompt);
    return {
      message: 'AI chat sent successfully',
      data: result,
    };
  }

  @UseGuards(JwtGuard)
  @Get()
  async getAll(@Request() req: any) {
    const result = await this.aiChatService.getAll(req.user);
    return {
      message: 'AI chats retrieved successfully',
      data: result,
    };
  }
}
