import { healthRepo } from '@workspace/db/repos/health.repo';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import betterAuthApp from './handlers/better-auth.handler';
import { type IdentityContext } from './middlewares/identity';
const app = new Hono<IdentityContext>().basePath('/api');

app.use(
  '*', // or replace with "*" to enable cors for all routes
  cors({
    origin: 'http://localhost:4321', // replace with your origin
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['POST', 'GET', 'OPTIONS', 'PUT', 'DELETE'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
    credentials: true,
  })
);

app.get('/health', async (c) => {
  console.log('Getting health');
  const result = await healthRepo.getHealth();

  const allEnv = Object.keys(c.env);
  console.log('Result', result);
  return c.json({
    ...result,
    allEnv,
  });
});

app.route('/auth/*', betterAuthApp);

export default app;
