import { env } from '@workspace/config/env';
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/schema',
  out: './src/migrations',
  dbCredentials: {
    url: env.DB_URL,
  },
  dialect: 'postgresql'
} satisfies Config;
