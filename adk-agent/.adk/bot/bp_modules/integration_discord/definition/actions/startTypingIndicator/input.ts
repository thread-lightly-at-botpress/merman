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
          "The ID of the conversation where the typing indicator should be shown",
        ),
      messageId: z
        .string()
        .title("Message ID")
        .describe(
          "The message ID to which the typing indicator should be attached",
        ),
      timeout: z.optional(
        z
          .number()
          .title("Typing Indicator Timeout")
          .describe(
            "The timeout in milliseconds after which the typing indicator should stop",
          ),
      ),
    })
    .catchall(z.never()),
};
