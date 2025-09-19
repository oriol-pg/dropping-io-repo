import { user } from "@workspace/db/schema/auth";
import { SocialLinks, ThemeConfig } from "@workspace/types/db";
import {
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const profile = pgTable(
  "profile",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    authUserId: text("auth_user_id")
      .notNull()
      .unique()
      .references(() => user.id, { onDelete: "cascade" }),
    username: text("username").notNull().unique(),
    displayName: text("display_name"),
    avatarUrl: text("avatar_url"),
    bio: text("bio"),

    // Denormalized counters
    totalDrops: integer("total_drops").default(0),
    activeDrops: integer("active_drops").default(0),
    totalRevenue: integer("total_revenue").default(0),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index("idx_profile_auth_user").on(table.authUserId),
    index("idx_profile_username").on(table.username),
  ],
).enableRLS();

export const profileSetting = pgTable(
  "profile_setting",
  {
    profileId: uuid("profile_id")
      .primaryKey()
      .references(() => profile.id, { onDelete: "cascade" }),
    customDomain: text("custom_domain").unique(),
    defaultTheme: jsonb("default_theme").$type<ThemeConfig>().default({}),
    socialLinks: jsonb("social_links").$type<SocialLinks>().default({}),
    notificationPreferences: jsonb("notification_preferences").default({}),
    stripeAccountId: text("stripe_account_id").unique(),
    stripeCustomerId: text("stripe_customer_id").unique(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [index("idx_setting_domain").on(table.customDomain)],
).enableRLS();

export const deviceFingerprint = pgTable(
  "device_fingerprint",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    fingerprintHash: text("fingerprint_hash").notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    lastSeenAt: timestamp("last_seen_at", { withTimezone: true }).defaultNow(),
    purchaseCount: integer("purchase_count").default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [index("idx_device_fingerprint").on(table.fingerprintHash)],
).enableRLS();
