import { neon } from '@neondatabase/serverless';
import { Injectable } from '@nestjs/common';
import { NeonHttpDatabase, drizzle } from 'drizzle-orm/neon-http';
import { config } from '../config';
import { DrizzleLogger } from './drizzle.logger';
import * as schema from './schema/index';

@Injectable()
export class DrizzleService {
  public readonly db: NeonHttpDatabase<typeof schema>;
  // private readonly logger: Logger = new Logger(DrizzleService.name);

  constructor() {
    this.db = this.getDb();
  }

  private getDb(): NeonHttpDatabase<typeof schema> {
    // neonConfig.fetchConnectionCache = true;
    const sql = neon(config().database.url!);
    return drizzle(sql, { schema, logger: new DrizzleLogger() });
  }
}
