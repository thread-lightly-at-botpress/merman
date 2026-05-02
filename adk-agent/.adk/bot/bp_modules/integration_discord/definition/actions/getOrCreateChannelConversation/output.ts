/* eslint-disable */
/* tslint:disable */
// This file is generated. Do not edit it manually.

import { z } from "@botpress/sdk";
export const output = {
  schema: z
    .object({
      conversationId: z
        .string()
        .title("Conversation ID")
        .describe("The Botpress ID of the created conversation"),
    })
    .catchall(z.never()),
};
