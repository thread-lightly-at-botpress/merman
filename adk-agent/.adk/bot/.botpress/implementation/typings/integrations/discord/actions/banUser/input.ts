/* eslint-disable */
/* tslint:disable */
// This file is generated. Do not edit it manually.

export type Input = {
  /** The ID of the guild */
  guildId: string;
  /** The ID of the user to ban */
  userId: string;
  /** Number of seconds of messages to delete (0-604800) */
  deleteMessageSeconds?: number;
  /** Reason for the ban (appears in audit log) */
  reason?: string;
};
