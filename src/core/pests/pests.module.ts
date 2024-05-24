import { Module } from '@nestjs/common';
import { DrizzleService } from '~/common/drizzle/drizzle.service';
import { PestsController } from './pests.controller';
import { PestsService } from './pests.service';
import { CommonModule } from '~/common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [PestsController],
  providers: [PestsService, DrizzleService],
})
export class PestsModule {}
