/* eslint-disable */
/* tslint:disable */
// This file is generated. Do not edit it manually.

import { z } from "@botpress/sdk";
export const input = {
  schema: z
    .object({
      conversationId: z
        .string()
        .title("Conversation ID")
        .describe(
          "The ID of the conversation where the typing indicator should be removed",
        ),
      messageId: z
        .string()
        .title("Message ID")
        .describe(
          "The message ID from which the typing indicator should be removed",
        ),
    })
    .catchall(z.never()),
};
