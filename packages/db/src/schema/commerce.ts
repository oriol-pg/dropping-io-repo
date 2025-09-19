import { price } from "@workspace/db/schema/catalaog";
import { deviceFingerprint, profile } from "@workspace/db/schema/profile";
import {
  index,
  integer,
  jsonb,
  pgSchema,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const commerceSchema = pgSchema("commerce");

export const customers = commerceSchema
  .table(
    "customers",
    {
      id: uuid("id").primaryKey().defaultRandom(),
      stripeCustomerId: text("stripe_customer_id").unique(),
      email: text("email"),
      phone: text("phone"),
      deviceFingerprintId: uuid("device_fingerprint_id").references(
        () => deviceFingerprint.id,
      ),
      firstPurchaseAt: timestamp("first_purchase_at", { withTimezone: true }),
      lastPurchaseAt: timestamp("last_purchase_at", { withTimezone: true }),
      lifetimeValue: integer("lifetime_value").default(0),
      metadata: jsonb("metadata").default({}),
      createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    },
    (table) => [
      index("idx_customers_stripe").on(table.stripeCustomerId),
      index("idx_customers_email").on(table.email),
    ],
  )
  .enableRLS();

export const checkoutSessions = commerceSchema
  .table(
    "checkout_sessions",
    {
      id: uuid("id").primaryKey().defaultRandom(),
      stripeSessionId: text("stripe_session_id").unique().notNull(),
      profileId: uuid("profile_id")
        .notNull()
        .references(() => profile.id),
      customerId: uuid("customer_id").references(() => customers.id),
      deviceFingerprintId: uuid("device_fingerprint_id").references(
        () => deviceFingerprint.id,
      ),

      status: text("status").notNull(),
      paymentStatus: text("payment_status"),
      lineItems: jsonb("line_items").notNull(),
      amountSubtotal: integer("amount_subtotal"),
      amountTotal: integer("amount_total"),
      currency: text("currency").default("EUR"),

      expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
      completedAt: timestamp("completed_at", { withTimezone: true }),

      metadata: jsonb("metadata").default({}),
      createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    },
    (table) => [
      index("idx_sessions_stripe").on(table.stripeSessionId),
      index("idx_sessions_status").on(table.status, table.createdAt.desc()),
    ],
  )
  .enableRLS();

export const orders = commerceSchema
  .table(
    "orders",
    {
      id: uuid("id").primaryKey().defaultRandom(),
      orderNumber: text("order_number").unique().notNull(),
      stripePaymentIntentId: text("stripe_payment_intent_id").unique(),
      checkoutSessionId: uuid("checkout_session_id").references(
        () => checkoutSessions.id,
      ),

      profileId: uuid("profile_id")
        .notNull()
        .references(() => profile.id),
      customerId: uuid("customer_id").references(() => customers.id),
      customerEmail: text("customer_email").notNull(),

      subtotal: integer("subtotal").notNull(),
      taxAmount: integer("tax_amount").default(0),
      shippingAmount: integer("shipping_amount").default(0),
      total: integer("total").notNull(),
      currency: text("currency").default("EUR"),

      paymentStatus: text("payment_status", {
        enum: ["pending", "paid", "failed", "refunded", "partial_refunded"],
      }).default("pending"),
      fulfillmentStatus: text("fulfillment_status", {
        enum: ["unfulfilled", "processing", "shipped", "delivered", "returned"],
      }).default("unfulfilled"),

      metadata: jsonb("metadata").default({}),
      createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    },
    (table) => [
      index("idx_orders_profile_date").on(
        table.profileId,
        table.createdAt.desc(),
      ),
      index("idx_orders_number").on(table.orderNumber),
    ],
  )
  .enableRLS();

export const orderItems = commerceSchema
  .table(
    "order_items",
    {
      id: uuid("id").primaryKey().defaultRandom(),
      orderId: uuid("order_id")
        .notNull()
        .references(() => orders.id, { onDelete: "cascade" }),
      priceId: uuid("price_id")
        .notNull()
        .references(() => price.id),
      stripePriceId: text("stripe_price_id"),

      productName: text("product_name").notNull(),
      variantLabel: text("variant_label"),
      quantity: integer("quantity").notNull(),
      unitAmount: integer("unit_amount").notNull(),
      totalAmount: integer("total_amount").notNull(),

      metadata: jsonb("metadata").default({}),
      createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    },
    (table) => [index("idx_items_order").on(table.orderId)],
  )
  .enableRLS();
