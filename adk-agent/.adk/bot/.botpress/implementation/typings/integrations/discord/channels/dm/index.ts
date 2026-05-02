/* eslint-disable */
/* tslint:disable */
// This file is generated. Do not edit it manually.

import { Messages } from './messages/index'
export * from './messages/index'

export type Dm = {
  messages: Messages
  message: { "tags": { "channelId": { "title": "Channel ID", "description": "The Discord ID of the channel where the message was sent" }, "id": { "title": "ID", "description": "The Discord ID of the message sent" }, "mentionsBot": { "title": "Mentions Bot?", "description": "Whether the message mentions the Discord bot" }, "ts": { "title": "Timestamp", "description": "The timestamp of the message" }, "userId": { "title": "User ID", "description": "The Discord ID of the user who sent the message" } } }
  conversation: { "tags": { "guildId": { "title": "Guild ID", "description": "The ID of the Discord guild" }, "id": { "title": "Discord Channel ID", "description": "The Discord channel ID" }, "title": { "title": "Title", "description": "A human-readable title for the conversation" } }, "creation": { "enabled": false, "requiredTags": [] } }
}