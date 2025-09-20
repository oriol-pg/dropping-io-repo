import { healthRepo } from '@workspace/db/repos/health.repo';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import betterAuthApp from './handlers/better-auth.handler';
import { type IdentityContext } from './middlewares/identity';
const app = new Hono<IdentityContext>().basePath('/api');

app.use('*', async (c, next) => {
  const corsMiddlewareHandler = cors({
    origin: c.env.BETTER_AUTH_ALLOWED_ORIGINS.split(';'),
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['POST', 'GET', 'OPTIONS', 'PUT', 'DELETE'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
    credentials: true,
  });
  return corsMiddlewareHandler(c, next);
});

const hiddenEnv = ['BETTER_AUTH_SECRET', 'DB_URL'];
app.get('/health', async (c) => {
  console.log('Getting health');
  const result = await healthRepo.getHealth();

  const allEnv = Object.fromEntries(
    Object.entries(c.env).map(([key, value]) => [key, hiddenEnv.includes(key) ? '********' : value])
  );

  const allowedOrigins = c.env.BETTER_AUTH_ALLOWED_ORIGINS?.split(';') || [];

  console.log('Result a :)', result);
  console.log('Allowed Origins:', allowedOrigins);

  return c.json({
    ...result,
    allEnv,
    allowedOrigins,
  });
});

app.route('/auth/*', betterAuthApp);

export default app;
