/* eslint-disable */
/* tslint:disable */
// This file is generated. Do not edit it manually.

import { z } from "@botpress/sdk";
export const output = {
  schema: z
    .object({
      user: z
        .object({
          id: z.string().describe("User ID"),
          username: z.string().describe("Username"),
          discriminator: z.string().describe("User discriminator"),
          globalName: z.optional(
            z
              .union([z.string().describe("Global display name"), z.null()])
              .metadata({ def: { typeName: "ZodNullable" } }),
          ),
          avatar: z.optional(
            z
              .union([z.string().describe("User avatar hash"), z.null()])
              .metadata({ def: { typeName: "ZodNullable" } }),
          ),
          bot: z.optional(z.boolean().describe("Whether the user is a bot")),
        })
        .catchall(z.never()),
      nick: z.optional(
        z
          .union([z.string().describe("Nickname in the guild"), z.null()])
          .metadata({ def: { typeName: "ZodNullable" } }),
      ),
      avatar: z.optional(
        z
          .union([z.string().describe("Guild-specific avatar hash"), z.null()])
          .metadata({ def: { typeName: "ZodNullable" } }),
      ),
      roles: z.array(z.string()).describe("Array of role IDs"),
      joinedAt: z.string().describe("When the user joined the guild (ISO8601)"),
      deaf: z
        .boolean()
        .describe("Whether the user is deafened in voice channels"),
      mute: z.boolean().describe("Whether the user is muted in voice channels"),
    })
    .catchall(z.never()),
};
