/* eslint-disable */
/* tslint:disable */
// This file is generated. Do not edit it manually.

import { z } from "@botpress/sdk";
export const input = {
  schema: z
    .object({
      guildId: z.string().title("Guild ID").describe("The ID of the guild"),
      name: z.optional(z.string().title("Name").describe("Name of the role")),
      color: z.optional(
        z
          .number()
          .min(0, undefined)
          .max(16777215, undefined)
          .title("Color")
          .describe("RGB color value of the role"),
      ),
      hoist: z.optional(
        z
          .boolean()
          .title("Hoist")
          .describe(
            "Whether the role should be displayed separately in the sidebar",
          ),
      ),
      mentionable: z.optional(
        z
          .boolean()
          .title("Mentionable")
          .describe("Whether the role can be mentioned"),
      ),
      reason: z.optional(
        z
          .string()
          .title("Reason")
          .describe("Reason for creating the role (appears in audit log)"),
      ),
    })
    .catchall(z.never()),
};
