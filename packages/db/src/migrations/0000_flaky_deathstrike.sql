CREATE SCHEMA "catalog";
--> statement-breakpoint
CREATE SCHEMA "commerce";
--> statement-breakpoint
CREATE SCHEMA "inventory";
--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "catalog"."drop" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" uuid NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"theme" jsonb,
	"status" text DEFAULT 'draft',
	"launch_at" timestamp with time zone,
	"end_at" timestamp with time zone,
	"pricing_type" text DEFAULT 'fixed',
	"pricing_rules" jsonb,
	"max_per_customer" integer DEFAULT 1,
	"view_count" integer DEFAULT 0,
	"order_count" integer DEFAULT 0,
	"revenue_total" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "unique_profile_slug" UNIQUE("profile_id","slug")
);
--> statement-breakpoint
CREATE TABLE "catalog"."price" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"stripe_price_id" text NOT NULL,
	"product_id" uuid NOT NULL,
	"variant_label" text,
	"variant_attributes" jsonb,
	"amount" integer,
	"currency" text DEFAULT 'EUR',
	"custom_pricing_rules" jsonb,
	"active" boolean DEFAULT true,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "price_stripe_price_id_unique" UNIQUE("stripe_price_id")
);
--> statement-breakpoint
CREATE TABLE "catalog"."product" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"stripe_product_id" text,
	"drop_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"images" text[],
	"attributes" jsonb DEFAULT '{}'::jsonb,
	"active" boolean DEFAULT true,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "product_stripe_product_id_unique" UNIQUE("stripe_product_id")
);
--> statement-breakpoint
CREATE TABLE "commerce"."checkout_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"stripe_session_id" text NOT NULL,
	"profile_id" uuid NOT NULL,
	"customer_id" uuid,
	"device_fingerprint_id" uuid,
	"status" text NOT NULL,
	"payment_status" text,
	"line_items" jsonb NOT NULL,
	"amount_subtotal" integer,
	"amount_total" integer,
	"currency" text DEFAULT 'EUR',
	"expires_at" timestamp with time zone NOT NULL,
	"completed_at" timestamp with time zone,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "checkout_sessions_stripe_session_id_unique" UNIQUE("stripe_session_id")
);
--> statement-breakpoint
CREATE TABLE "commerce"."customers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"stripe_customer_id" text,
	"email" text,
	"phone" text,
	"device_fingerprint_id" uuid,
	"first_purchase_at" timestamp with time zone,
	"last_purchase_at" timestamp with time zone,
	"lifetime_value" integer DEFAULT 0,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "customers_stripe_customer_id_unique" UNIQUE("stripe_customer_id")
);
--> statement-breakpoint
CREATE TABLE "commerce"."order_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"price_id" uuid NOT NULL,
	"stripe_price_id" text,
	"product_name" text NOT NULL,
	"variant_label" text,
	"quantity" integer NOT NULL,
	"unit_amount" integer NOT NULL,
	"total_amount" integer NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "commerce"."orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_number" text NOT NULL,
	"stripe_payment_intent_id" text,
	"checkout_session_id" uuid,
	"profile_id" uuid NOT NULL,
	"customer_id" uuid,
	"customer_email" text NOT NULL,
	"subtotal" integer NOT NULL,
	"tax_amount" integer DEFAULT 0,
	"shipping_amount" integer DEFAULT 0,
	"total" integer NOT NULL,
	"currency" text DEFAULT 'EUR',
	"payment_status" text DEFAULT 'pending',
	"fulfillment_status" text DEFAULT 'unfulfilled',
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "orders_order_number_unique" UNIQUE("order_number"),
	CONSTRAINT "orders_stripe_payment_intent_id_unique" UNIQUE("stripe_payment_intent_id")
);
--> statement-breakpoint
CREATE TABLE "inventory"."ledger" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"price_id" uuid NOT NULL,
	"type" text NOT NULL,
	"quantity" integer NOT NULL,
	"reference_id" text,
	"idempotency_key" text,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "ledger_idempotency_key_unique" UNIQUE("idempotency_key")
);
--> statement-breakpoint
CREATE TABLE "inventory"."reservations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"checkout_session_id" text NOT NULL,
	"price_id" uuid NOT NULL,
	"device_fingerprint_id" uuid,
	"quantity" integer NOT NULL,
	"price_snapshot" integer NOT NULL,
	"customer_ip" text,
	"expires_at" timestamp with time zone NOT NULL,
	"status" text DEFAULT 'active',
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "inventory"."stock" (
	"price_id" uuid PRIMARY KEY NOT NULL,
	"available" integer DEFAULT 0 NOT NULL,
	"reserved" integer DEFAULT 0 NOT NULL,
	"sold" integer DEFAULT 0 NOT NULL,
	"version" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "device_fingerprint" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"fingerprint_hash" text NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"last_seen_at" timestamp with time zone DEFAULT now(),
	"purchase_count" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "profile" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"auth_user_id" text NOT NULL,
	"username" text NOT NULL,
	"display_name" text,
	"avatar_url" text,
	"bio" text,
	"total_drops" integer DEFAULT 0,
	"active_drops" integer DEFAULT 0,
	"total_revenue" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "profile_auth_user_id_unique" UNIQUE("auth_user_id"),
	CONSTRAINT "profile_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "profile_setting" (
	"profile_id" uuid PRIMARY KEY NOT NULL,
	"custom_domain" text,
	"default_theme" jsonb DEFAULT '{}'::jsonb,
	"social_links" jsonb DEFAULT '{}'::jsonb,
	"notification_preferences" jsonb DEFAULT '{}'::jsonb,
	"stripe_account_id" text,
	"stripe_customer_id" text,
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "profile_setting_custom_domain_unique" UNIQUE("custom_domain"),
	CONSTRAINT "profile_setting_stripe_account_id_unique" UNIQUE("stripe_account_id"),
	CONSTRAINT "profile_setting_stripe_customer_id_unique" UNIQUE("stripe_customer_id")
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "catalog"."drop" ADD CONSTRAINT "drop_profile_id_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "catalog"."price" ADD CONSTRAINT "price_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "catalog"."product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "catalog"."product" ADD CONSTRAINT "product_drop_id_drop_id_fk" FOREIGN KEY ("drop_id") REFERENCES "catalog"."drop"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commerce"."checkout_sessions" ADD CONSTRAINT "checkout_sessions_profile_id_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profile"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commerce"."checkout_sessions" ADD CONSTRAINT "checkout_sessions_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "commerce"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commerce"."checkout_sessions" ADD CONSTRAINT "checkout_sessions_device_fingerprint_id_device_fingerprint_id_fk" FOREIGN KEY ("device_fingerprint_id") REFERENCES "public"."device_fingerprint"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commerce"."customers" ADD CONSTRAINT "customers_device_fingerprint_id_device_fingerprint_id_fk" FOREIGN KEY ("device_fingerprint_id") REFERENCES "public"."device_fingerprint"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commerce"."order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "commerce"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commerce"."order_items" ADD CONSTRAINT "order_items_price_id_price_id_fk" FOREIGN KEY ("price_id") REFERENCES "catalog"."price"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commerce"."orders" ADD CONSTRAINT "orders_checkout_session_id_checkout_sessions_id_fk" FOREIGN KEY ("checkout_session_id") REFERENCES "commerce"."checkout_sessions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commerce"."orders" ADD CONSTRAINT "orders_profile_id_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profile"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commerce"."orders" ADD CONSTRAINT "orders_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "commerce"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory"."ledger" ADD CONSTRAINT "ledger_price_id_price_id_fk" FOREIGN KEY ("price_id") REFERENCES "catalog"."price"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory"."reservations" ADD CONSTRAINT "reservations_price_id_price_id_fk" FOREIGN KEY ("price_id") REFERENCES "catalog"."price"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory"."reservations" ADD CONSTRAINT "reservations_device_fingerprint_id_device_fingerprint_id_fk" FOREIGN KEY ("device_fingerprint_id") REFERENCES "public"."device_fingerprint"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory"."stock" ADD CONSTRAINT "stock_price_id_price_id_fk" FOREIGN KEY ("price_id") REFERENCES "catalog"."price"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile" ADD CONSTRAINT "profile_auth_user_id_user_id_fk" FOREIGN KEY ("auth_user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_setting" ADD CONSTRAINT "profile_setting_profile_id_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_drop_active" ON "catalog"."drop" USING btree ("launch_at","id") WHERE "catalog"."drop"."status" = 'active';--> statement-breakpoint
CREATE INDEX "idx_drop_profile" ON "catalog"."drop" USING btree ("profile_id","status");--> statement-breakpoint
CREATE INDEX "idx_price_product" ON "catalog"."price" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "idx_price_stripe" ON "catalog"."price" USING btree ("stripe_price_id");--> statement-breakpoint
CREATE INDEX "idx_product_drop" ON "catalog"."product" USING btree ("drop_id");--> statement-breakpoint
CREATE INDEX "idx_product_stripe" ON "catalog"."product" USING btree ("stripe_product_id");--> statement-breakpoint
CREATE INDEX "idx_sessions_stripe" ON "commerce"."checkout_sessions" USING btree ("stripe_session_id");--> statement-breakpoint
CREATE INDEX "idx_sessions_status" ON "commerce"."checkout_sessions" USING btree ("status","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "idx_customers_stripe" ON "commerce"."customers" USING btree ("stripe_customer_id");--> statement-breakpoint
CREATE INDEX "idx_customers_email" ON "commerce"."customers" USING btree ("email");--> statement-breakpoint
CREATE INDEX "idx_items_order" ON "commerce"."order_items" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "idx_orders_profile_date" ON "commerce"."orders" USING btree ("profile_id","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "idx_orders_number" ON "commerce"."orders" USING btree ("order_number");--> statement-breakpoint
CREATE INDEX "idx_ledger_price_time" ON "inventory"."ledger" USING btree ("price_id","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "idx_ledger_idempotency" ON "inventory"."ledger" USING btree ("idempotency_key");--> statement-breakpoint
CREATE INDEX "idx_reservations_session" ON "inventory"."reservations" USING btree ("checkout_session_id");--> statement-breakpoint
CREATE INDEX "idx_reservations_expires" ON "inventory"."reservations" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "idx_stock_available" ON "inventory"."stock" USING btree ("available");--> statement-breakpoint
CREATE INDEX "idx_device_fingerprint" ON "device_fingerprint" USING btree ("fingerprint_hash");--> statement-breakpoint
CREATE INDEX "idx_profile_auth_user" ON "profile" USING btree ("auth_user_id");--> statement-breakpoint
CREATE INDEX "idx_profile_username" ON "profile" USING btree ("username");--> statement-breakpoint
CREATE INDEX "idx_setting_domain" ON "profile_setting" USING btree ("custom_domain");