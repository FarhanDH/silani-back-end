import { Module } from '@nestjs/common';
import { AppController } from '~/app.controller';
import { AppService } from '~/app.service';
import { CommonModule } from '~/common/common.module';
import { PestsModule } from './core/pests/pests.module';

@Module({
  imports: [CommonModule, PestsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
