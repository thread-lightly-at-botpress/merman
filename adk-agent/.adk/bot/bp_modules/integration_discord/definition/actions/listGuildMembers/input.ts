/* eslint-disable */
/* tslint:disable */
// This file is generated. Do not edit it manually.

import { z } from "@botpress/sdk";
export const input = {
  schema: z
    .object({
      guildId: z
        .string()
        .title("Guild ID")
        .describe("The ID of the guild to retrieve members for"),
      limit: z.optional(
        z
          .number()
          .min(1, undefined)
          .max(1000, undefined)
          .title("Limit")
          .describe("Max number of members to return (1-1000), default 1"),
      ),
      after: z.optional(
        z
          .string()
          .title("After")
          .describe('The highest user id in the previous page, default \"0\"'),
      ),
    })
    .catchall(z.never()),
};
