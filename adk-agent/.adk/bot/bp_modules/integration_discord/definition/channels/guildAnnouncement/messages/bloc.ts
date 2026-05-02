/* eslint-disable */
/* tslint:disable */
// This file is generated. Do not edit it manually.

import { z } from "@botpress/sdk";
export const bloc = {
  schema: z
    .object({
      items: z.array(
        z.union([
          z
            .object({
              type: z.literal("text"),
              payload: z
                .object({
                  text: z.string().min(1, undefined),
                })
                .catchall(z.never()),
            })
            .catchall(z.never()),
          z
            .object({
              type: z.literal("image"),
              payload: z
                .object({
                  imageUrl: z.string().min(1, undefined),
                  title: z.optional(z.string().min(1, undefined)),
                })
                .catchall(z.never()),
            })
            .catchall(z.never()),
          z
            .object({
              type: z.literal("audio"),
              payload: z
                .object({
                  audioUrl: z.string().min(1, undefined),
                  title: z.optional(z.string().min(1, undefined)),
                })
                .catchall(z.never()),
            })
            .catchall(z.never()),
          z
            .object({
              type: z.literal("video"),
              payload: z
                .object({
                  videoUrl: z.string().min(1, undefined),
                  title: z.optional(z.string().min(1, undefined)),
                })
                .catchall(z.never()),
            })
            .catchall(z.never()),
          z
            .object({
              type: z.literal("file"),
              payload: z
                .object({
                  fileUrl: z.string().min(1, undefined),
                  title: z.optional(z.string().min(1, undefined)),
                })
                .catchall(z.never()),
            })
            .catchall(z.never()),
          z
            .object({
              type: z.literal("location"),
              payload: z
                .object({
                  latitude: z.number(),
                  longitude: z.number(),
                  address: z.optional(z.string()),
                  title: z.optional(z.string()),
                })
                .catchall(z.never()),
            })
            .catchall(z.never()),
          z
            .object({
              type: z.literal("dropdown"),
              payload: z
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
            })
            .catchall(z.never()),
          z
            .object({
              type: z.literal("choice"),
              payload: z
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
            })
            .catchall(z.never()),
          z
            .object({
              type: z.literal("card"),
              payload: z
                .object({
                  title: z.string().min(1, undefined),
                  subtitle: z.optional(z.string().min(1, undefined)),
                  imageUrl: z.optional(z.string().min(1, undefined)),
                  actions: z.array(
                    z
                      .object({
                        action: z.enum(["postback", "url", "say"]),
                        label: z.string().min(1, undefined),
                        value: z.string().min(1, undefined),
                      })
                      .catchall(z.never()),
                  ),
                })
                .catchall(z.never()),
            })
            .catchall(z.never()),
          z
            .object({
              type: z.literal("carousel"),
              payload: z
                .object({
                  items: z.array(
                    z
                      .object({
                        title: z.string().min(1, undefined),
                        subtitle: z.optional(z.string().min(1, undefined)),
                        imageUrl: z.optional(z.string().min(1, undefined)),
                        actions: z.array(
                          z
                            .object({
                              action: z.enum(["postback", "url", "say"]),
                              label: z.string().min(1, undefined),
                              value: z.string().min(1, undefined),
                            })
                            .catchall(z.never()),
                        ),
                      })
                      .catchall(z.never()),
                  ),
                })
                .catchall(z.never()),
            })
            .catchall(z.never()),
          z
            .object({
              type: z.literal("rawComponents"),
              payload: z
                .object({
                  components: z
                    .array(z.string())
                    .describe(
                      "An array of JSON strings that represent Discord components",
                    ),
                  fileUrls: z.optional(
                    z
                      .array(z.string())
                      .describe(
                        "File URLs to attach, referenced in the components JSON as attachment://file-0.<ext>, attachment://file-1.<ext>, etc.",
                      ),
                  ),
                })
                .catchall(z.never()),
            })
            .catchall(z.never()),
        ]),
      ),
    })
    .catchall(z.never()),
};
