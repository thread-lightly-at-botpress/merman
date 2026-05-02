/* eslint-disable */
/* tslint:disable */
// This file is generated. Do not edit it manually.

import { z } from "@botpress/sdk";
export const messagePollVoteChanged = {
  title: "Message Poll Vote Changed",
  description: "Triggered when a user adds or removes their vote on a poll",
  attributes: {},
  schema: z
    .object({
      userId: z.string().title("User ID").describe("Discord user ID"),
      channelId: z
        .string()
        .title("Channel ID")
        .describe("Channel containing the poll"),
      messageId: z
        .string()
        .title("Message ID")
        .describe("Message containing the poll"),
      guildId: z.optional(
        z.string().title("Guild ID").describe("Guild ID, absent in DMs"),
      ),
      answerId: z.number().title("Answer ID").describe("ID of the answer"),
      action: z
        .enum(["add", "remove"])
        .title("Action")
        .describe("Whether the vote was added or removed"),
    })
    .catchall(z.never()),
};
