import { defineConfig, z } from "@botpress/runtime"

export default defineConfig({
    dependencies: {
        "integrations": {
            "discord": {
                "version": "discord@1.1.0",
                "enabled": true
            },
            "webchat": "webchat@0.3.0"
        }
    },
    defaultModels: {
        autonomous: "cerebras:gpt-oss-120b",
        zai: "cerebras:gpt-oss-120b",
    },
    secrets: {
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
