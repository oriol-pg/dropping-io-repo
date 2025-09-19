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
