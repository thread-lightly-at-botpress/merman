/* eslint-disable */
/* tslint:disable */
// This file is generated. Do not edit it manually.

export type Input = {
  /** The ID of the channel to create the poll in */
  channelId: string;
  /** The question of the poll */
  question: string;
  /** The answers available in the poll (1-10) */
  answers: Array<{
    /** The text of the answer */
    text: string;
    /** An optional emoji for the answer */
    emoji?: string;
  }>;
  /** Number of hours the poll should be open for, up to 768 (32 days). Defaults to 24 */
  duration?: number;
  /** Whether a user can select multiple answers. Defaults to false */
  allowMultiselect?: boolean;
};
