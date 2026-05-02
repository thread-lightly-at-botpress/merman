/* eslint-disable */
/* tslint:disable */
// This file is generated. Do not edit it manually.

import { z } from "@botpress/sdk";
export const input = {
  schema: z
    .object({
      guildId: z.string().title("Guild ID").describe("The ID of the guild"),
      userId: z
        .string()
        .title("User ID")
        .describe("The ID of the user to retrieve"),
    })
    .catchall(z.never()),
};
