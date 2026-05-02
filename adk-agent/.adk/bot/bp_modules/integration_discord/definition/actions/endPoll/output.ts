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
        .describe("The ID of the message with the ended poll"),
      poll: z
        .union([
          z
            .object({
              question: z.string().describe("The poll question text"),
              answers: z
                .array(
                  z
                    .object({
                      answerId: z.number().describe("The ID of the answer"),
                      text: z.string().describe("The answer text"),
                    })
                    .catchall(z.never()),
                )
                .describe("The poll answers"),
              expiry: z.union([
                z.string().describe("When the poll expires (ISO 8601)"),
                z.null(),
              ]),
              allowMultiselect: z
                .boolean()
                .describe("Whether users can select multiple answers"),
              answerCounts: z
                .array(
                  z
                    .object({
                      id: z.number().describe("The ID of the answer"),
                      count: z
                        .number()
                        .describe("Number of votes for this answer"),
                      meVoted: z
                        .boolean()
                        .describe("Whether the bot voted for this answer"),
                    })
                    .catchall(z.never()),
                )
                .describe("Vote counts per answer"),
              isFinalized: z
                .boolean()
                .describe("Whether the poll results are finalized"),
            })
            .catchall(z.never())
            .describe("The poll results, null if no poll data returned"),
          z.null(),
        ])
        .metadata({ def: { typeName: "ZodNullable" } }),
    })
    .catchall(z.never()),
};
