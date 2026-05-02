/* eslint-disable */
/* tslint:disable */
// This file is generated. Do not edit it manually.

import { z } from "@botpress/sdk";
export const tt = {
  type: "integration" as const,
  schema: z
    .object({
      transportKey: z.string().describe("The transport-translator session key"),
    })
    .catchall(z.never()),
};
