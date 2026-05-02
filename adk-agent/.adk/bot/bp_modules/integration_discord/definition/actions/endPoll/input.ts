/* eslint-disable */
/* tslint:disable */
// This file is generated. Do not edit it manually.

import { z } from "@botpress/sdk";
export const input = {
  schema: z
    .object({
      channelId: z
        .string()
        .title("Channel ID")
        .describe("The ID of the channel containing the poll"),
      messageId: z
        .string()
        .title("Message ID")
        .describe("The ID of the message containing the poll"),
    })
    .catchall(z.never()),
};
