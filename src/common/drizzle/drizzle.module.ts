import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { config } from '../config';
import { DrizzleService } from './drizzle.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, load: [config] })],
  providers: [DrizzleService],
  exports: [DrizzleService],
})
export class DrizzleModule {}
