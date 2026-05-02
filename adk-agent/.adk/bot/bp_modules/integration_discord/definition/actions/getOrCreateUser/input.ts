/* eslint-disable */
/* tslint:disable */
// This file is generated. Do not edit it manually.

import { z } from "@botpress/sdk";
export const input = {
  schema: z
    .object({
      name: z.optional(
        z.string().title("Name").describe("The name of the user"),
      ),
      pictureUrl: z.optional(
        z
          .string()
          .title("Picture URL")
          .describe("The URL of the user profile picture"),
      ),
      email: z.optional(
        z.string().title("Email").describe("The email of the user"),
      ),
      user: z
        .object({
          id: z.string().title("User ID").describe("The Discord user ID"),
        })
        .catchall(z.never()),
    })
    .catchall(z.never()),
};
