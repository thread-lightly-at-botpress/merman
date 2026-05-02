/* eslint-disable */
/* tslint:disable */
// This file is generated. Do not edit it manually.

export type Output = {
  members: Array<{
    user: {
      /** User ID */
      id: string;
      /** Username */
      username: string;
      /** User discriminator */
      discriminator: string;
      globalName?: /** Display name */ string | null;
      avatar?: /** Avatar hash */ string | null;
      /** Whether the user is a bot */
      bot?: boolean;
    };
    nick?: /** Guild-specific nickname */ string | null;
    avatar?: /** Guild-specific avatar hash */ string | null;
    /** Array of role IDs */
    roles: string[];
    /** When the user joined the guild (ISO8601) */
    joinedAt: string;
    /** Whether the user is deafened in voice channels */
    deaf: boolean;
    /** Whether the user is muted in voice channels */
    mute: boolean;
  }>;
};
