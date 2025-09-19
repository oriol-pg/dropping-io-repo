import { deviceFingerprint } from "@workspace/db/schema/profile";
import {
  index,
  integer,
  jsonb,
  pgSchema,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { price } from "./catalaog";

export const inventorySchema = pgSchema("inventory");

export const stock = inventorySchema
  .table(
    "stock",
    {
      priceId: uuid("price_id")
        .primaryKey()
        .references(() => price.id, { onDelete: "cascade" }),
      available: integer("available").notNull().default(0),
      reserved: integer("reserved").notNull().default(0),
      sold: integer("sold").notNull().default(0),
      version: integer("version").notNull().default(0),
      updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
    },
    (table) => [index("idx_stock_available").on(table.available)],
  )
  .enableRLS();

export const ledger = inventorySchema
  .table(
    "ledger",
    {
      id: uuid("id").primaryKey().defaultRandom(),
      priceId: uuid("price_id")
        .notNull()
        .references(() => price.id),
      type: text("type", {
        enum: ["add", "reserve", "release", "purchase", "return"],
      }).notNull(),
      quantity: integer("quantity").notNull(),
      referenceId: text("reference_id"),
      idempotencyKey: text("idempotency_key").unique(),
      metadata: jsonb("metadata").$type<Record<string, any>>(),
      createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    },
    (table) => [
      index("idx_ledger_price_time").on(table.priceId, table.createdAt.desc()),
      index("idx_ledger_idempotency").on(table.idempotencyKey),
    ],
  )
  .enableRLS();

export const reservations = inventorySchema
  .table(
    "reservations",
    {
      id: uuid("id").primaryKey().defaultRandom(),
      checkoutSessionId: text("checkout_session_id").notNull(),
      priceId: uuid("price_id")
        .notNull()
        .references(() => price.id),
      deviceFingerprintId: uuid("device_fingerprint_id").references(
        () => deviceFingerprint.id,
      ),
      quantity: integer("quantity").notNull(),
      priceSnapshot: integer("price_snapshot").notNull(),
      customerIp: text("customer_ip"),
      expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
      status: text("status", {
        enum: ["active", "converted", "expired", "cancelled"],
      }).default("active"),
      createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    },
    (table) => [
      index("idx_reservations_session").on(table.checkoutSessionId),
      index("idx_reservations_expires").on(table.expiresAt),
    ],
  )
  .enableRLS();
