/* eslint-disable */
/* tslint:disable */
// This file is generated. Do not edit it manually.

import { z } from "@botpress/sdk";
export const input = {
  schema: z
    .object({
      guildId: z
        .string()
        .title("Guild ID")
        .describe("The ID of the guild to create the channel in"),
      name: z.string().title("Name").describe("The name of the channel"),
      type: z.optional(
        z
          .number()
          .title("Type")
          .describe("Channel type. Defaults to Guild Text (0)."),
      ),
      topic: z.optional(z.string().title("Topic").describe("Channel topic")),
      position: z.optional(
        z
          .number()
          .title("Position")
          .describe("Sorting position of the channel"),
      ),
      nsfw: z.optional(
        z.boolean().title("NSFW").describe("Whether the channel is NSFW"),
      ),
      parentId: z.optional(
        z.string().title("Parent ID").describe("ID of the parent category"),
      ),
    })
    .catchall(z.never()),
};
