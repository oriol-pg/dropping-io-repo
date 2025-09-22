import type { Drop, Price, Product } from "@workspace/db/schema/types";
import * as authSchema from "./auth";
import * as catalogSchema from "./catalaog";
import * as commerceSchema from "./commerce";
import * as inventorySchema from "./inventory";
import * as profileSchema from "./profile";

export const schema = {
  ...authSchema,
  ...profileSchema,
  ...commerceSchema,
  ...catalogSchema,
  ...inventorySchema,
};

export type { Drop, Price, Product };

const _product: Product = {
  active: true,
  attributes: {},
  createdAt: new Date(),
  updatedAt: new Date(),
  metadata: {},
  dropId: "1",
  images: [""],
  name: "Product 1",
  description: "Product 1 description",
  id: "1",
  stripeProductId: "1",
};
