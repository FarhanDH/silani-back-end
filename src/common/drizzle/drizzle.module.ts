import { Module } from '@nestjs/common';
import { DrizzleService } from './drizzle.service';
import { ConfigModule } from '@nestjs/config';
import { config } from '../config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, load: [config] })],
  providers: [DrizzleService],
})
export class DrizzleModule {}
