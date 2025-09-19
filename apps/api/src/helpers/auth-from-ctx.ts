import { getIdentityClient } from '@workspace/identity/client';
import { Context } from 'hono';
import { IdentityContext } from '../middlewares/identity';

export const authFromCtx = (c: Context<IdentityContext>) => {
  return getIdentityClient({
    secret: c.env.BETTER_AUTH_SECRET,
    baseURL: c.env.BETTER_AUTH_URL,
    trustedOrigins: ['http://localhost:4321', c.env.BETTER_AUTH_URL],
    socialProviders: {},
  });
};
