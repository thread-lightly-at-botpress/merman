/* eslint-disable */
/* tslint:disable */
// This file is generated. Do not edit it manually.

import { z } from "@botpress/sdk";
export const output = {
  schema: z
    .object({
      messages: z.array(
        z
          .object({
            id: z.string().describe("Message ID"),
            channelId: z.string().describe("Channel ID"),
            guildId: z.optional(
              z
                .union([z.string().describe("Guild ID"), z.null()])
                .metadata({ def: { typeName: "ZodNullable" } }),
            ),
            author: z
              .object({
                id: z.string().describe("User ID"),
                username: z.string().describe("Username"),
                discriminator: z.string().describe("User discriminator"),
                globalName: z.optional(
                  z
                    .union([
                      z.string().describe("Global display name"),
                      z.null(),
                    ])
                    .metadata({ def: { typeName: "ZodNullable" } }),
                ),
                avatar: z.optional(
                  z
                    .union([z.string().describe("User avatar hash"), z.null()])
                    .metadata({ def: { typeName: "ZodNullable" } }),
                ),
                bot: z.optional(
                  z.boolean().describe("Whether the user is a bot"),
                ),
              })
              .catchall(z.never()),
            content: z.optional(
              z
                .union([z.string().describe("Message content"), z.null()])
                .metadata({ def: { typeName: "ZodNullable" } }),
            ),
            timestamp: z
              .string()
              .describe("When the message was sent (ISO8601)"),
            type: z.number().describe("Type of message"),
          })
          .catchall(z.never()),
      ),
    })
    .catchall(z.never()),
};
