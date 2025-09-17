import db from "@workspace/db/client";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { magicLink } from "better-auth/plugins";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),

  plugins: [
    magicLink({
      sendMagicLink: async (email, link) => {
        console.log(`Sending magic link to ${email} with link ${link}`);
      },
    })
  ]
});

