/* eslint-disable */
/* tslint:disable */
// This file is generated. Do not edit it manually.

import { z } from "@botpress/sdk";
export const choice = {
  schema: z
    .object({
      title: z.optional(z.string()),
      options: z.array(
        z
          .object({
            label: z.string(),
            value: z.string(),
            style: z.default(
              z.enum(["primary", "secondary", "success", "danger"]),
              "primary",
            ),
          })
          .catchall(z.never()),
      ),
    })
    .catchall(z.never()),
};
