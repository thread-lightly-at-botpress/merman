/* eslint-disable */
/* tslint:disable */
// This file is generated. Do not edit it manually.

export type Input = {
  conversation: {
    /** The type of the discord channel */
    channelType:
      | "dm"
      | "guildText"
      | "guildAnnouncement"
      | "announcementThread"
      | "publicThread"
      | "privateThread";
    /** The discord channel id */
    channelId: string;
    /** The discord channel title */
    channelTitle: string;
    /** The discord guild the channel is in */
    guildId?: string;
  };
};
