/* eslint-disable */
/* tslint:disable */
// This file is generated. Do not edit it manually.

import { z } from "@botpress/sdk";
export const guildMemberAdded = {
  title: "Guild Member Added",
  description: "Triggered when a user joins a guild",
  attributes: {},
  schema: z
    .object({
      userId: z
        .string()
        .title("User ID")
        .describe("Discord user ID of the member who joined"),
      guildId: z.string().title("Guild ID").describe("Guild the member joined"),
      username: z
        .string()
        .title("Username")
        .describe("Discord username of the member"),
      joinedAt: z
        .string()
        .title("Joined At")
        .describe("ISO 8601 timestamp of when the member joined"),
    })
    .catchall(z.never()),
};
