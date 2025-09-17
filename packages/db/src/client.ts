import { env } from '@workspace/config/env';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';
import { schema } from './schema';


const db = drizzle({
  connection: env.DB_URL,
  ws: ws,
  schema,
});

export default db;
