/* eslint-disable */
/* tslint:disable */
// This file is generated. Do not edit it manually.

import { z } from "@botpress/sdk";
export const video = {
  schema: z
    .object({
      videoUrl: z.string().min(1, undefined),
      title: z.optional(z.string().min(1, undefined)),
    })
    .catchall(z.never()),
};
