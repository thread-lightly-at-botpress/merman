/* eslint-disable */
/* tslint:disable */
// This file is generated. Do not edit it manually.

import { z } from "@botpress/sdk";
export const input = {
  schema: z
    .object({
      path: z
        .string()
        .regex(/^\//, undefined)
        .title("Path")
        .describe("The API path (e.g. /channels/123/messages)"),
      queryParams: z.optional(
        z
          .array(
            z
              .object({
                key: z.string(),
                value: z.string(),
              })
              .catchall(z.never()),
          )
          .title("Query Parameters")
          .describe("The query parameters to send along with the request"),
      ),
      method: z
        .enum(["GET", "POST", "PUT", "PATCH", "DELETE"])
        .title("Method")
        .describe("The HTTP method to use"),
      body: z.optional(
        z
          .string()
          .title("Body")
          .describe("JSON string to send as the request body"),
      ),
    })
    .catchall(z.never()),
};
