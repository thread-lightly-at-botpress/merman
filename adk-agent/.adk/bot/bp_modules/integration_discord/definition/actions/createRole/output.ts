/* eslint-disable */
/* tslint:disable */
// This file is generated. Do not edit it manually.

import { z } from "@botpress/sdk";
export const output = {
  schema: z
    .object({
      id: z.string().title("Role ID").describe("The ID of the created role"),
      name: z.string().title("Name").describe("Name of the role"),
      color: z.number().title("Color").describe("RGB color value of the role"),
      hoist: z
        .boolean()
        .title("Hoist")
        .describe("Whether the role is displayed separately in the sidebar"),
      position: z
        .number()
        .title("Position")
        .describe("Position of the role in the hierarchy"),
      permissions: z
        .string()
        .title("Permissions")
        .describe("Bitwise permissions value of the role"),
      mentionable: z
        .boolean()
        .title("Mentionable")
        .describe("Whether the role can be mentioned"),
    })
    .catchall(z.never()),
};
