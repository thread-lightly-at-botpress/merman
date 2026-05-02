/* eslint-disable */
/* tslint:disable */
// This file is generated. Do not edit it manually.

import { z } from "@botpress/sdk";
export const text = {
  schema: z
    .object({
      text: z.string().min(1, undefined),
    })
    .catchall(z.never()),
};
