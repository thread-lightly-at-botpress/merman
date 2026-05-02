/* eslint-disable */
/* tslint:disable */
// This file is generated. Do not edit it manually.

import * as configuration from "./configuration/index"
import * as configurations from "./configurations/index"
import * as actions from "./actions/index"
import * as channels from "./channels/index"
import * as events from "./events/index"
import * as states from "./states/index"
import * as entities from "./entities/index"
export * as configuration from "./configuration/index"
export * as configurations from "./configurations/index"
export * as actions from "./actions/index"
export * as channels from "./channels/index"
export * as events from "./events/index"
export * as states from "./states/index"
export * as entities from "./entities/index"

export type TIntegration = {
  name: "discord"
  version: "1.1.0"
  user: { "tags": { "avatar": { "title": "Discord Avatar", "description": "The Discord avatar id" }, "dmConversationId": { "title": "DM Conversation ID", "description": "The Botpress conversation ID for the DM channel with this user" }, "id": { "title": "Discord User ID", "description": "The Discord user ID" }, "username": { "title": "Discord Username", "description": "The Discord username" } }, "creation": { "enabled": false, "requiredTags": [] } }
  configuration: configuration.Configuration
  configurations: configurations.Configurations
  actions: actions.Actions
  channels: channels.Channels
  events: events.Events
  states: states.States
  entities: entities.Entities
}