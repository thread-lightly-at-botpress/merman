/* eslint-disable */
/* tslint:disable */
// This file is generated. Do not edit it manually.

export type MessagePollVoteChanged = {
  /** Discord user ID */
  userId: string;
  /** Channel containing the poll */
  channelId: string;
  /** Message containing the poll */
  messageId: string;
  /** Guild ID, absent in DMs */
  guildId?: string;
  /** ID of the answer */
  answerId: number;
  /** Whether the vote was added or removed */
  action: "add" | "remove";
};
