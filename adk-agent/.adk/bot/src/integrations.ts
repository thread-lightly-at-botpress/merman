import { IntegrationPackage } from "@botpress/sdk";


import integration_discord from "../bp_modules/integration_discord";

export const IntegrationDefinitions = {
 "discord": integration_discord
} as Record<string, IntegrationPackage>;