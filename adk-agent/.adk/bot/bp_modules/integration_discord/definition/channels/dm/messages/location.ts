/* eslint-disable */
/* tslint:disable */
// This file is generated. Do not edit it manually.

import { z } from "@botpress/sdk";
export const location = {
  schema: z
    .object({
      latitude: z.number(),
      longitude: z.number(),
      address: z.optional(z.string()),
      title: z.optional(z.string()),
    })
    .catchall(z.never()),
};
