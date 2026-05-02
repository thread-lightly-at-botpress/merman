/* eslint-disable */
/* tslint:disable */
// This file is generated. Do not edit it manually.

import { z } from "@botpress/sdk";
export const output = {
  schema: z
    .object({
      id: z.string().describe("Guild ID"),
      name: z.string().describe("Guild name"),
      icon: z
        .union([z.string().describe("Icon hash"), z.null()])
        .metadata({ def: { typeName: "ZodNullable" } }),
      description: z
        .union([z.string().describe("Guild description"), z.null()])
        .metadata({ def: { typeName: "ZodNullable" } }),
      splash: z
        .union([z.string().describe("Splash hash"), z.null()])
        .metadata({ def: { typeName: "ZodNullable" } }),
      discoverySplash: z
        .union([z.string().describe("Discovery splash hash"), z.null()])
        .metadata({ def: { typeName: "ZodNullable" } }),
      features: z.array(z.string()).describe("Enabled guild features"),
      banner: z
        .union([z.string().describe("Banner hash"), z.null()])
        .metadata({ def: { typeName: "ZodNullable" } }),
      ownerId: z.string().describe("ID of the guild owner"),
      region: z.optional(
        z
          .union([
            z.string().describe("Voice region ID (deprecated)"),
            z.null(),
          ])
          .metadata({ def: { typeName: "ZodNullable" } }),
      ),
      afkChannelId: z
        .union([z.string().describe("AFK channel ID"), z.null()])
        .metadata({ def: { typeName: "ZodNullable" } }),
      afkTimeout: z.number().describe("AFK timeout in seconds"),
      verificationLevel: z
        .number()
        .describe("Verification level required for the guild"),
      defaultMessageNotifications: z
        .number()
        .describe("Default message notification level"),
      mfaLevel: z.number().describe("Required MFA level for the guild"),
      explicitContentFilter: z
        .number()
        .describe("Explicit content filter level"),
      maxPresences: z.optional(
        z
          .union([z.number().describe("Maximum number of presences"), z.null()])
          .metadata({ def: { typeName: "ZodNullable" } }),
      ),
      maxMembers: z.optional(z.number().describe("Maximum number of members")),
      vanityUrlCode: z
        .union([z.string().describe("Vanity URL code"), z.null()])
        .metadata({ def: { typeName: "ZodNullable" } }),
      premiumTier: z.number().describe("Premium tier (Server Boost level)"),
      premiumSubscriptionCount: z.optional(
        z.number().describe("Number of boosts"),
      ),
      systemChannelId: z
        .union([z.string().describe("System channel ID"), z.null()])
        .metadata({ def: { typeName: "ZodNullable" } }),
      systemChannelFlags: z.number().describe("System channel flags"),
      rulesChannelId: z
        .union([z.string().describe("Rules channel ID"), z.null()])
        .metadata({ def: { typeName: "ZodNullable" } }),
      publicUpdatesChannelId: z
        .union([z.string().describe("Public updates channel ID"), z.null()])
        .metadata({ def: { typeName: "ZodNullable" } }),
      safetyAlertsChannelId: z.optional(
        z
          .union([z.string().describe("Safety alerts channel ID"), z.null()])
          .metadata({ def: { typeName: "ZodNullable" } }),
      ),
      preferredLocale: z.string().describe("Preferred locale"),
      approximateMemberCount: z.optional(
        z
          .number()
          .describe(
            "Approximate number of members (only present when withCounts is true)",
          ),
      ),
      approximatePresenceCount: z.optional(
        z
          .number()
          .describe(
            "Approximate number of online members (only present when withCounts is true)",
          ),
      ),
      roles: z.array(
        z
          .object({
            id: z.string().title("ID").describe("The role ID"),
            name: z.string().title("Name").describe("The role\'s name"),
            color: z
              .number()
              .title("Color")
              .describe("RGB color value of the role"),
            hoist: z
              .boolean()
              .title("Hoist")
              .describe(
                "Whether the role is displayed separately in the sidebar",
              ),
            position: z
              .number()
              .title("Position")
              .describe("The role\'s position in the hierarchy"),
            permissions: z
              .string()
              .title("Permissions")
              .describe("Bitwise permissions value of the role"),
            mentionable: z
              .boolean()
              .title("Mentionable")
              .describe("Whether the role can be mentioned"),
          })
          .catchall(z.never()),
      ),
    })
    .catchall(z.never()),
};
