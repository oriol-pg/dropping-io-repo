import { Hono } from 'hono';
import { authFromCtx } from '../helpers/auth-from-ctx';
import { IdentityContext } from '../middlewares/identity';

const betterAuthApp = new Hono<IdentityContext>();
betterAuthApp.on(['POST', 'GET'], '', (c) => {
  return authFromCtx(c).handler(c.req.raw);
});

export default betterAuthApp;
