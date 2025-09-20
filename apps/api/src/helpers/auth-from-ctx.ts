import { getIdentityClient } from '@workspace/identity/client';
import { Context } from 'hono';
import { IdentityContext } from '../middlewares/identity';

export const authFromCtx = (c: Context<IdentityContext>) => {
  const trustedOrigins = [...c.env.BETTER_AUTH_ALLOWED_ORIGINS.split(';'), c.env.BETTER_AUTH_URL];

  console.log('🔐 Creating Identity Client with:');
  console.log('  📍 Base URL:', c.env.BETTER_AUTH_URL);
  console.log('  🔑 Secret:', '*****'.repeat(8));
  console.log('  🌐 Trusted Origins:', trustedOrigins);
  console.log('  👥 Social Providers:', Object.keys({}).length === 0 ? 'None' : Object.keys({}));

  return getIdentityClient({
    secret: c.env.BETTER_AUTH_SECRET,
    baseURL: c.env.BETTER_AUTH_URL,
    emailApiKey: c.env.RESEND_API_KEY,
    trustedOrigins,
    socialProviders: {},
  });
};
