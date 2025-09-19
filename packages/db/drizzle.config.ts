import type { Config } from "drizzle-kit";

export default {
  schema: "./src/schema",
  out: "./src/migrations",
  dbCredentials: {
    url: process.env.DB_URL!,
  },
  dialect: "postgresql",
} satisfies Config;
