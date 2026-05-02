/* eslint-disable */
/* tslint:disable */
// This file is generated. Do not edit it manually.

export type ReactionChanged = {
  /** Discord user ID of the user who reacted */
  userId: string;
  /** Channel containing the message */
  channelId: string;
  /** Message that was reacted to */
  messageId: string;
  /** Guild ID, absent in DMs */
  guildId?: string;
  /** Unicode name or custom emoji name */
  emojiName: string;
  /** Custom emoji ID, absent for standard unicode emoji */
  emojiId?: string;
  /** Whether the reaction was added or removed */
  action: "add" | "remove";
};
