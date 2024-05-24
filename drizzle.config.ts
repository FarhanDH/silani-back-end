import { defineConfig } from 'drizzle-kit';
import { config } from './src/common/config';

export default defineConfig({
  dialect: 'postgresql', // "mysql" | "sqlite" | "postgresql"
  schema: './src/common/drizzle/schema/*.ts' as string,
  out: './src/common/drizzle/migrations',
  dbCredentials: {
    url: config().database.url,
  },
  verbose: true,
  strict: true,
});
