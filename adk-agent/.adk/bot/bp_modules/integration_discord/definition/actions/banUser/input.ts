/* eslint-disable */
/* tslint:disable */
// This file is generated. Do not edit it manually.

import { z } from "@botpress/sdk";
export const input = {
  schema: z
    .object({
      guildId: z.string().title("Guild ID").describe("The ID of the guild"),
      userId: z.string().title("User ID").describe("The ID of the user to ban"),
      deleteMessageSeconds: z.optional(
        z
          .number()
          .min(0, undefined)
          .max(604800, undefined)
          .title("Delete Message Seconds")
          .describe("Number of seconds of messages to delete (0-604800)"),
      ),
      reason: z.optional(
        z
          .string()
          .title("Reason")
          .describe("Reason for the ban (appears in audit log)"),
      ),
    })
    .catchall(z.never()),
};
