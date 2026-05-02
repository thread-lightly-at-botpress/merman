/* eslint-disable */
/* tslint:disable */
// This file is generated. Do not edit it manually.

import { z } from "@botpress/sdk";
export const rawComponents = {
  schema: z
    .object({
      components: z
        .array(z.string())
        .describe("An array of JSON strings that represent Discord components"),
      fileUrls: z.optional(
        z
          .array(z.string())
          .describe(
            "File URLs to attach, referenced in the components JSON as attachment://file-0.<ext>, attachment://file-1.<ext>, etc.",
          ),
      ),
    })
    .catchall(z.never()),
};
