import { env } from "@workspace/config/env";
import db from "@workspace/db/client";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { magicLink } from "better-auth/plugins";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  plugins: [
    magicLink({
      sendMagicLink: async (email, link) => {
        console.log(`Sending magic link to ${email} with link ${link}`);
      },
    })
  ]
});

