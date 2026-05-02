import { defineConfig, z } from "@botpress/runtime"

export default defineConfig({
    dependencies: {
        integrations: {
            discord: "discord@latest",
        },
    },
    defaultModels: {
        autonomous: "cerebras:gpt-oss-120b",
        zai: "cerebras:gpt-oss-120b",
    },
    configuration: {
        schema: z.object({
            DISCORD_BOT_TOKEN: z.string(),
            DISCORD_CLIENT_ID: z.string(),
            DISCORD_PUBLIC_KEY: z.string(),
        }),
    },
    secrets: {
        COMPILER_API_URL: { optional: true },
        COMPILER_API_KEY: { optional: true },
        DISCORD_BOT_TOKEN: {},
        DISCORD_CLIENT_ID: {},
        DISCORD_PUBLIC_KEY: {},
    },
    bot: {
        state: z.object({
            totalCompiles: z.number().default(0),
            lastCompileRequestId: z.string().nullable().default(null),
        }),
    },
})
