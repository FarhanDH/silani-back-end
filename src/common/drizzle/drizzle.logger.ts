import { Logger } from '@nestjs/common';

export class DrizzleLogger {
  private readonly logger: Logger = new Logger('Drizzle');
  logQuery(query: string, params: unknown[]): void {
    this.logger.debug({ query, params });
  }
}
