/* eslint-disable */
/* tslint:disable */
// This file is generated. Do not edit it manually.

import { z } from "@botpress/sdk";
export const output = {
  schema: z
    .object({
      userId: z
        .string()
        .title("User ID")
        .describe("The Botpress ID of the created user"),
    })
    .catchall(z.never()),
};
