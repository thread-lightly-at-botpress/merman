/* eslint-disable */
/* tslint:disable */
// This file is generated. Do not edit it manually.

import { z } from "@botpress/sdk";
export const input = {
  schema: z
    .object({
      guildId: z.string().title("Guild ID").describe("The ID of the guild"),
      roleId: z
        .string()
        .title("Role ID")
        .describe("The ID of the role to delete"),
      reason: z.optional(
        z
          .string()
          .title("Reason")
          .describe("Reason for deleting the role (appears in audit log)"),
      ),
    })
    .catchall(z.never()),
};
