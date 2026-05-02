/* eslint-disable */
/* tslint:disable */
// This file is generated. Do not edit it manually.

import { z } from "@botpress/sdk";
export const dropdown = {
  schema: z
    .object({
      text: z.string().min(1, undefined),
      options: z.array(
        z
          .object({
            label: z.string(),
            value: z.string(),
            description: z.optional(z.string()),
          })
          .catchall(z.never()),
      ),
      id: z.string(),
    })
    .catchall(z.never()),
};
