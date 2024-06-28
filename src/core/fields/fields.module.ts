import { Module } from '@nestjs/common';
import { FieldsService } from './fields.service';
import { FieldsController } from './fields.controller';
import { StorageModule } from '../storage/storage.module';
import { DrizzleModule } from '~/common/drizzle/drizzle.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [DrizzleModule, StorageModule, UsersModule],
  controllers: [FieldsController],
  providers: [FieldsService],
  exports: [FieldsService],
})
export class FieldsModule {}
