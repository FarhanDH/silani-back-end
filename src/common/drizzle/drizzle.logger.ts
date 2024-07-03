// import { Logger } from '@nestjs/common';
import { ConsoleLogger } from '@nestjs/common';
import { DefaultLogger } from 'drizzle-orm';

export class DrizzleLogger extends DefaultLogger {
  private readonly logger: ConsoleLogger = new ConsoleLogger('Drizzle');
  logQuery(query: string, params: unknown[]): void {
    this.logger.debug('Object: ');
    console.log({ query, params });
  }
}
