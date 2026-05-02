/* eslint-disable */
/* tslint:disable */
// This file is generated. Do not edit it manually.

import { z } from "@botpress/sdk";
export const input = {
  schema: z
    .object({
      channelId: z
        .string()
        .title("Channel Id")
        .describe("The id of the channel"),
      messageId: z
        .string()
        .title("Message Id")
        .describe("The id of the message"),
      emoji: z
        .string()
        .title("Emoji")
        .describe("Can be either the actual emoji or its id"),
    })
    .catchall(z.never()),
};
