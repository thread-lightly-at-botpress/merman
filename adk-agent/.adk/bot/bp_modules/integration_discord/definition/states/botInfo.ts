/* eslint-disable */
/* tslint:disable */
// This file is generated. Do not edit it manually.

import { z } from "@botpress/sdk";
export const botInfo = {
  type: "integration" as const,
  schema: z
    .object({
      botUserId: z.string().describe("The Discord bot user ID"),
      botUsername: z.string().describe("The Discord bot username"),
    })
    .catchall(z.never()),
};
