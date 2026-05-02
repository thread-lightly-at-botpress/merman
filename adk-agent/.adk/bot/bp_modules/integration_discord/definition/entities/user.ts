/* eslint-disable */
/* tslint:disable */
// This file is generated. Do not edit it manually.

import { z } from "@botpress/sdk";
export const user = {
  title: "User",
  description: "A Discord user",
  schema: z
    .object({
      id: z.string().title("User ID").describe("The Discord user ID"),
    })
    .catchall(z.never()),
};
