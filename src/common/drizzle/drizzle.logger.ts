import { Logger } from 'drizzle-orm';

export class DrizzleLogger implements Logger {
  logQuery(query: string, params: unknown[]): void {
    console.log({ query, params });
  }
}
