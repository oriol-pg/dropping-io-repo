import { type IdentityClient } from '@workspace/identity/client';
import { Context, Next } from 'hono';
import { authFromCtx } from '../helpers/auth-from-ctx';

export type IdentityContext = {
  Variables: {
    user: IdentityClient['$Infer']['Session']['user'] | null;
    session: IdentityClient['$Infer']['Session']['session'] | null;
  };
  Bindings: Cloudflare.Env;
};

export const identityMiddleware = async (c: Context<IdentityContext>, next: Next) => {
  const session = await authFromCtx(c).api.getSession({ headers: c.req.raw.headers });
  if (!session) {
    c.set('user', null);
    c.set('session', null);
    return next();
  }

  c.set('user', session.user);
  c.set('session', session.session);
  return next();
};
