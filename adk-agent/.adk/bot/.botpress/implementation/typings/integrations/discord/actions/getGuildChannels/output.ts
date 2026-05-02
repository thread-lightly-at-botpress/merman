/* eslint-disable */
/* tslint:disable */
// This file is generated. Do not edit it manually.

export type Output = {
  channels: Array<{
    /** Channel ID */
    id: string;
    /** Channel type */
    type: number;
    /** Channel name */
    name?: string;
    /** Sorting position of the channel */
    position?: number;
    parentId?: /** ID of the parent category */ string | null;
    topic?: /** Channel topic */ string | null;
    /** Whether the channel is NSFW */
    nsfw?: boolean;
    lastMessageId?: /** ID of the last message sent */ string | null;
  }>;
};
