/* eslint-disable */
/* tslint:disable */
// This file is generated. Do not edit it manually.

import { z } from "@botpress/sdk";
export const input = {
  schema: z
    .object({
      guildId: z.string().title("Guild ID").describe("The ID of the guild"),
      userId: z.string().title("User ID").describe("The ID of the user"),
      roleId: z.string().title("Role ID").describe("The ID of the role to add"),
      reason: z.optional(
        z
          .string()
          .title("Reason")
          .describe("Reason for adding the role (appears in audit log)"),
      ),
    })
    .catchall(z.never()),
};
