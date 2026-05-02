/* eslint-disable */
/* tslint:disable */
// This file is generated. Do not edit it manually.

import { z } from "@botpress/sdk";
export const output = {
  schema: z
    .object({
      messageId: z
        .string()
        .title("Message ID")
        .describe("The ID of the message containing the poll"),
      answers: z
        .array(
          z
            .object({
              answerId: z
                .number()
                .title("Answer ID")
                .describe("The ID of the answer"),
              text: z.string().title("Text").describe("The answer text"),
            })
            .catchall(z.never()),
        )
        .title("Answers")
        .describe("The poll answers with their Discord-assigned IDs"),
    })
    .catchall(z.never()),
};
