import type { drop, price, product } from './catalaog';

export type Drop = typeof drop.$inferSelect;
export type Price = typeof price.$inferSelect;
export type Product = typeof product.$inferSelect;

