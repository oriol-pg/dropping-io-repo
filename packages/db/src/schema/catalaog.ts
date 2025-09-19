import {
  PricingRules,
  ProductAttributes,
  ThemeConfig,
} from "@workspace/types/db";
import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgSchema,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { profile } from "./profile";

export const catalogSchema = pgSchema("catalog");

export const drop = catalogSchema
  .table(
    "drop",
    {
      id: uuid("id").primaryKey().defaultRandom(),
      profileId: uuid("profile_id")
        .notNull()
        .references(() => profile.id, { onDelete: "cascade" }),
      slug: text("slug").notNull(),
      title: text("title").notNull(),
      description: text("description"),

      // Drop-specific theme
      theme: jsonb("theme").$type<ThemeConfig>(),

      status: text("status", {
        enum: ["draft", "coming_soon", "active", "archived"],
      }).default("draft"),
      launchAt: timestamp("launch_at", { withTimezone: true }),
      endAt: timestamp("end_at", { withTimezone: true }),

      // Pricing strategy
      pricingType: text("pricing_type", {
        enum: ["fixed", "halving", "auction", "tiered"],
      }).default("fixed"),
      pricingRules: jsonb("pricing_rules").$type<PricingRules>(),

      maxPerCustomer: integer("max_per_customer").default(1),

      // Analytics
      viewCount: integer("view_count").default(0),
      orderCount: integer("order_count").default(0),
      revenueTotal: integer("revenue_total").default(0),

      createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
      updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
    },
    (table) => [
      unique("unique_profile_slug").on(table.profileId, table.slug),
      index("idx_drop_active")
        .on(table.launchAt, table.id)
        .where(sql`${table.status} = 'active'`),
      index("idx_drop_profile").on(table.profileId, table.status),
    ],
  )
  .enableRLS();

export const product = catalogSchema
  .table(
    "product",
    {
      id: uuid("id").primaryKey().defaultRandom(),
      stripeProductId: text("stripe_product_id").unique(),
      dropId: uuid("drop_id")
        .notNull()
        .references(() => drop.id, { onDelete: "cascade" }),

      name: text("name").notNull(),
      description: text("description"),
      images: text("images").array(),

      attributes: jsonb("attributes").$type<ProductAttributes>().default({}),

      active: boolean("active").default(true),
      metadata: jsonb("metadata").default({}),

      createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
      updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
    },
    (table) => [
      index("idx_product_drop").on(table.dropId),
      index("idx_product_stripe").on(table.stripeProductId),
    ],
  )
  .enableRLS();

export const price = catalogSchema
  .table(
    "price",
    {
      id: uuid("id").primaryKey().defaultRandom(),
      stripePriceId: text("stripe_price_id").unique().notNull(),
      productId: uuid("product_id")
        .notNull()
        .references(() => product.id, { onDelete: "cascade" }),

      variantLabel: text("variant_label"),
      variantAttributes:
        jsonb("variant_attributes").$type<Record<string, string>>(),

      amount: integer("amount"),
      currency: text("currency").default("EUR"),

      customPricingRules: jsonb("custom_pricing_rules").$type<PricingRules>(),

      active: boolean("active").default(true),
      metadata: jsonb("metadata").default({}),

      createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    },
    (table) => [
      index("idx_price_product").on(table.productId),
      index("idx_price_stripe").on(table.stripePriceId),
    ],
  )
  .enableRLS();
