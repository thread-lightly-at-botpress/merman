/* eslint-disable */
/* tslint:disable */
// This file is generated. Do not edit it manually.

import { z } from "@botpress/sdk";
export const output = {
  schema: z
    .object({
      id: z.string().describe("Channel ID"),
      type: z.number().describe("Channel type"),
      name: z.optional(z.string().describe("Channel name")),
      position: z.optional(
        z.number().describe("Sorting position of the channel"),
      ),
      parentId: z.optional(
        z
          .union([z.string().describe("ID of the parent category"), z.null()])
          .metadata({ def: { typeName: "ZodNullable" } }),
      ),
      topic: z.optional(
        z
          .union([z.string().describe("Channel topic"), z.null()])
          .metadata({ def: { typeName: "ZodNullable" } }),
      ),
      nsfw: z.optional(z.boolean().describe("Whether the channel is NSFW")),
    })
    .catchall(z.never()),
};
