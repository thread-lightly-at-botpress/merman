/* eslint-disable */
/* tslint:disable */
// This file is generated. Do not edit it manually.

import { z } from "@botpress/sdk";
export const reactionChanged = {
  title: "Reaction Changed",
  description: "Triggered when a user adds or removes a reaction on a message",
  attributes: {},
  schema: z
    .object({
      userId: z
        .string()
        .title("User ID")
        .describe("Discord user ID of the user who reacted"),
      channelId: z
        .string()
        .title("Channel ID")
        .describe("Channel containing the message"),
      messageId: z
        .string()
        .title("Message ID")
        .describe("Message that was reacted to"),
      guildId: z.optional(
        z.string().title("Guild ID").describe("Guild ID, absent in DMs"),
      ),
      emojiName: z
        .string()
        .title("Emoji Name")
        .describe("Unicode name or custom emoji name"),
      emojiId: z.optional(
        z
          .string()
          .title("Emoji ID")
          .describe("Custom emoji ID, absent for standard unicode emoji"),
      ),
      action: z
        .enum(["add", "remove"])
        .title("Action")
        .describe("Whether the reaction was added or removed"),
    })
    .catchall(z.never()),
};
