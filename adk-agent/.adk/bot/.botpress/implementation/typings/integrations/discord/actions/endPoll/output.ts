/* eslint-disable */
/* tslint:disable */
// This file is generated. Do not edit it manually.

export type Output = {
  /** The ID of the message with the ended poll */
  messageId: string;
  poll: {
    /** The poll question text */
    question: string;
    /** The poll answers */
    answers: Array<{
      /** The ID of the answer */
      answerId: number;
      /** The answer text */
      text: string;
    }>;
    expiry: /** When the poll expires (ISO 8601) */ string | null;
    /** Whether users can select multiple answers */
    allowMultiselect: boolean;
    /** Vote counts per answer */
    answerCounts: Array<{
      /** The ID of the answer */
      id: number;
      /** Number of votes for this answer */
      count: number;
      /** Whether the bot voted for this answer */
      meVoted: boolean;
    }>;
    /** Whether the poll results are finalized */
    isFinalized: boolean;
  } | null;
};
