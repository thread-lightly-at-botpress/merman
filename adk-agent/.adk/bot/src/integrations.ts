import { IntegrationPackage } from "@botpress/sdk";


import integration_discord from "../bp_modules/integration_discord";
import integration_webchat from "../bp_modules/integration_webchat";

export const IntegrationDefinitions = {
 "discord": integration_discord,
"webchat": integration_webchat
} as Record<string, IntegrationPackage>;