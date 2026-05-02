/* eslint-disable */
/* tslint:disable */
// This file is generated. Do not edit it manually.

export type Input = {
  /** The ID of the guild to create the channel in */
  guildId: string;
  /** The name of the channel */
  name: string;
  /** Channel type. Defaults to Guild Text (0). */
  type?: number;
  /** Channel topic */
  topic?: string;
  /** Sorting position of the channel */
  position?: number;
  /** Whether the channel is NSFW */
  nsfw?: boolean;
  /** ID of the parent category */
  parentId?: string;
};
