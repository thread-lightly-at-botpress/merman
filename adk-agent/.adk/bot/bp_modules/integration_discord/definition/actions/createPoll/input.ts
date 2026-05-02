/* eslint-disable */
/* tslint:disable */
// This file is generated. Do not edit it manually.

import { z } from "@botpress/sdk";
export const input = {
  schema: z
    .object({
      channelId: z
        .string()
        .title("Channel ID")
        .describe("The ID of the channel to create the poll in"),
      question: z
        .string()
        .min(1, undefined)
        .title("Question")
        .describe("The question of the poll"),
      answers: z
        .array(
          z
            .object({
              text: z.string().title("Text").describe("The text of the answer"),
              emoji: z.optional(
                z
                  .string()
                  .title("Emoji")
                  .describe("An optional emoji for the answer"),
              ),
            })
            .catchall(z.never()),
        )
        .min(1, undefined)
        .max(10, undefined)
        .title("Answers")
        .describe("The answers available in the poll (1-10)"),
      duration: z.optional(
        z
          .number()
          .min(1, undefined)
          .max(768, undefined)
          .title("Duration")
          .describe(
            "Number of hours the poll should be open for, up to 768 (32 days). Defaults to 24",
          ),
      ),
      allowMultiselect: z.optional(
        z
          .boolean()
          .title("Allow Multiselect")
          .describe(
            "Whether a user can select multiple answers. Defaults to false",
          ),
      ),
    })
    .catchall(z.never()),
};
