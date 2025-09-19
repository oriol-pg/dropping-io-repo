import { z } from "zod";

export const ThemeConfigSchema = z.object({
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
  backgroundColor: z.string().optional(),
  fontFamily: z.string().optional(),
  borderRadius: z.enum(["none", "sm", "md", "lg"]).optional(),
  layout: z.enum(["grid", "list", "timeline"]).optional(),
  customCss: z.string().optional(),
});

export const PricingRulesSchema = z.object({
  type: z.enum(["halving", "auction", "tiered"]),
  halvingConfig: z
    .object({
      startPrice: z.number(),
      halvingIntervalMinutes: z.number(),
      minimumPrice: z.number(),
    })
    .optional(),
  auctionConfig: z
    .object({
      startPrice: z.number(),
      incrementPerPurchase: z.number(),
      maximumPrice: z.number(),
    })
    .optional(),
  tieredConfig: z
    .object({
      tiers: z.array(
        z.object({
          quantity: z.number(),
          price: z.number(),
        }),
      ),
    })
    .optional(),
});

export const ProductAttributesSchema = z.object({
  availableSizes: z.array(z.string()).optional(),
  availableColors: z.array(z.string()).optional(),
  customAttributes: z.record(z.string(), z.array(z.string())).optional(),
});

export const SocialLinksSchema = z.object({
  twitter: z.string().optional(),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  linkedin: z.string().optional(),
  tiktok: z.string().optional(),
  youtube: z.string().optional(),
  twitch: z.string().optional(),
  discord: z.string().optional(),
  reddit: z.string().optional(),
  github: z.string().optional(),
  gitlab: z.string().optional(),
  mastodon: z.string().optional(),
  medium: z.string().optional(),
  stackoverflow: z.string().optional(),
  telegram: z.string().optional(),
  x: z.string().optional(),
  website: z.string().optional(),
});

export type ThemeConfig = z.infer<typeof ThemeConfigSchema>;
export type PricingRules = z.infer<typeof PricingRulesSchema>;
export type ProductAttributes = z.infer<typeof ProductAttributesSchema>;
export type SocialLinks = z.infer<typeof SocialLinksSchema>;
