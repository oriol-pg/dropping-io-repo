import db from "@workspace/db/client";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { magicLink } from "better-auth/plugins";
type Database = typeof db;
type CreateIdentityClientProps = {
  secret: string;
  baseURL: string;
  trustedOrigins: string[];
  socialProviders: Record<string, {
    clientId: string;
    clientSecret: string;
  }>;
}


export type IdentityClient = ReturnType<typeof _createIdentityClient>;

let identityClient: IdentityClient | null = null;

export const _createIdentityClient = (
  { secret, baseURL, trustedOrigins, socialProviders }: CreateIdentityClientProps,
  _db: Database,
) => {

  const hasSocialProviders = Object.keys(socialProviders).length > 0;

  return betterAuth({
      database: drizzleAdapter(_db, {
        provider: "pg",
      }),
      secret: secret,
      baseURL: baseURL,
      trustedOrigins: trustedOrigins,
      socialProviders: {...(hasSocialProviders ? socialProviders : {})},
      plugins: [
      magicLink({
        sendMagicLink: async ({ email, url }) => {
          console.log({ url });
        },
      }),
    ],
  })
};


export const getIdentityClient = (
  props: CreateIdentityClientProps,
) => {
  console.log({
    trustedOrigins: props.trustedOrigins,
  })
  if (!identityClient) {
    identityClient = _createIdentityClient(props, db);
  }
  return identityClient;
};
