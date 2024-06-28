import { Module } from '@nestjs/common';
import { FieldPestsService } from './field-pests.service';
import { FieldPestsController } from './field-pests.controller';
import { DrizzleModule } from '~/common/drizzle/drizzle.module';
import { UsersModule } from '../users/users.module';
import { FieldsModule } from '../fields/fields.module';

@Module({
  imports: [DrizzleModule, FieldsModule, UsersModule],
  controllers: [FieldPestsController],
  providers: [FieldPestsService],
})
export class FieldPestsModule {}
