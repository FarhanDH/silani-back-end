import { Module } from '@nestjs/common';
import { AppController } from '~/app.controller';
import { AppService } from '~/app.service';
import { CommonModule } from '~/common/common.module';
import { PestsModule } from './core/pests/pests.module';
import { StorageModule } from './core/storage/storage.module';
import { AuthModule } from './core/auth/auth.module';
import { UsersModule } from './core/users/users.module';
import { PlantCategoriesModule } from './core/plant-categories/plant-categories.module';

@Module({
  imports: [
    CommonModule,
    PestsModule,
    StorageModule,
    AuthModule,
    UsersModule,
    PlantCategoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
