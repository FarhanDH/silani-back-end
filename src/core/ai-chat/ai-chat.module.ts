import { Module } from '@nestjs/common';
import { AiChatService } from './ai-chat.service';
import { AiChatController } from './ai-chat.controller';
import { UsersModule } from '../users/users.module';
import { StorageModule } from '../storage/storage.module';
import { DrizzleModule } from '~/common/drizzle/drizzle.module';

@Module({
  imports: [UsersModule, StorageModule, DrizzleModule],
  controllers: [AiChatController],
  providers: [AiChatService],
})
export class AiChatModule {}
