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
        .describe("The ID of the guild to retrieve"),
      withCounts: z.default(
        z
          .boolean()
          .title("With Counts")
          .describe(
            "When true, will return approximate member and presence counts for the guild",
          ),
        false,
      ),
    })
    .catchall(z.never()),
};
