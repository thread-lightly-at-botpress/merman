/* eslint-disable */
/* tslint:disable */
// This file is generated. Do not edit it manually.

export type Output = {
  messages: Array<{
    /** Message ID */
    id: string;
    /** Channel ID */
    channelId: string;
    guildId?: /** Guild ID */ string | null;
    author: {
      /** User ID */
      id: string;
      /** Username */
      username: string;
      /** User discriminator */
      discriminator: string;
      globalName?: /** Global display name */ string | null;
      avatar?: /** User avatar hash */ string | null;
      /** Whether the user is a bot */
      bot?: boolean;
    };
    content?: /** Message content */ string | null;
    /** When the message was sent (ISO8601) */
    timestamp: string;
    /** Type of message */
    type: number;
  }>;
};
