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
        .describe("The ID of the guild to retrieve channels for"),
    })
    .catchall(z.never()),
};
