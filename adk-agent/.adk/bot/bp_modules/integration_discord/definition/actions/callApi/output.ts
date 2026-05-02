/* eslint-disable */
/* tslint:disable */
// This file is generated. Do not edit it manually.

import { z } from "@botpress/sdk";
export const output = {
  schema: z
    .object({
      success: z
        .boolean()
        .title("Success")
        .describe("Whether the request was successful"),
      body: z.optional(
        z
          .any()
          .title("Response")
          .describe(
            "The response body as an object if the request was successful",
          ),
      ),
      error: z.optional(
        z
          .string()
          .title("Error")
          .describe("The error message if the request was not successful"),
      ),
      status: z.optional(
        z
          .number()
          .title("Status")
          .describe("The HTTP status code of the response"),
      ),
    })
    .catchall(z.never()),
};
