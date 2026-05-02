/* eslint-disable */
/* tslint:disable */
// This file is generated. Do not edit it manually.
class Secrets {
  public get DISCORD_BOT_TOKEN(): string {
    const envVarValue = process.env.SECRET_DISCORD_BOT_TOKEN
    if (!envVarValue) throw new Error('Missing required secret "DISCORD_BOT_TOKEN"')
    return envVarValue
  }
  public get DISCORD_CLIENT_ID(): string {
    const envVarValue = process.env.SECRET_DISCORD_CLIENT_ID
    if (!envVarValue) throw new Error('Missing required secret "DISCORD_CLIENT_ID"')
    return envVarValue
  }
  public get DISCORD_PUBLIC_KEY(): string {
    const envVarValue = process.env.SECRET_DISCORD_PUBLIC_KEY
    if (!envVarValue) throw new Error('Missing required secret "DISCORD_PUBLIC_KEY"')
    return envVarValue
  }
}
export const secrets = new Secrets()
