/* eslint-disable */
/* tslint:disable */
// This file is generated. Do not edit it manually.

import { z } from "@botpress/sdk";
export const credentials = {
  type: "integration" as const,
  schema: z
    .object({
      botToken: z
        .string()
        .title("Bot Token")
        .secret()
        .describe("Your Discord bot token from the Discord Developer Portal"),
    })
    .catchall(z.never()),
};
