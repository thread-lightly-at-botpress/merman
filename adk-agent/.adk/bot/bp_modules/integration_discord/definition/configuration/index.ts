/* eslint-disable */
/* tslint:disable */
// This file is generated. Do not edit it manually.

import { z } from "@botpress/sdk";
export const configuration = {
  schema: z
    .object({
      botAvatarUrl: z.optional(
        z
          .string()
          .title("Bot Avatar URL")
          .describe(
            "URL for the image used as the bot avatar (overrides Discord bot avatar)",
          ),
      ),
      botName: z.optional(
        z
          .string()
          .title("Bot Name")
          .describe(
            "Name displayed as the sender in Discord conversations (overrides Discord bot name)",
          ),
      ),
      typingIndicator: z.default(
        z
          .boolean()
          .title("Typing Indicator")
          .describe("Show typing indicator when bot is processing message"),
        false,
      ),
    })
    .catchall(z.never()),
};
