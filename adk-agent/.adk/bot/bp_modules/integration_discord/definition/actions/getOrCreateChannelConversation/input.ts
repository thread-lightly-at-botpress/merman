/* eslint-disable */
/* tslint:disable */
// This file is generated. Do not edit it manually.

import { z } from "@botpress/sdk";
export const input = {
  schema: z
    .object({
      conversation: z
        .object({
          channelType: z
            .enum([
              "dm",
              "guildText",
              "guildAnnouncement",
              "announcementThread",
              "publicThread",
              "privateThread",
            ])
            .title("Channel Type")
            .describe("The type of the discord channel"),
          channelId: z
            .string()
            .min(1, undefined)
            .title("Channel Id")
            .describe("The discord channel id"),
          channelTitle: z
            .string()
            .min(1, undefined)
            .title("Channel Title")
            .describe("The discord channel title"),
          guildId: z.optional(
            z
              .string()
              .title("Guild Id")
              .describe("The discord guild the channel is in"),
          ),
        })
        .catchall(z.never()),
    })
    .catchall(z.never()),
};
