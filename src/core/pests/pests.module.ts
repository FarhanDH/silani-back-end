import { Module } from '@nestjs/common';
import { DrizzleService } from '~/common/drizzle/drizzle.service';
import { PestsController } from './pests.controller';
import { PestsService } from './pests.service';
import { CommonModule } from '~/common/common.module';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [CommonModule, StorageModule],
  controllers: [PestsController],
  providers: [PestsService, DrizzleService],
})
export class PestsModule {}
