/* eslint-disable */
/* tslint:disable */
// This file is generated. Do not edit it manually.
import * as announcementThread from "./announcementThread/index";
export * as announcementThread from "./announcementThread/index";
import * as dm from "./dm/index";
export * as dm from "./dm/index";
import * as guildAnnouncement from "./guildAnnouncement/index";
export * as guildAnnouncement from "./guildAnnouncement/index";
import * as guildText from "./guildText/index";
export * as guildText from "./guildText/index";
import * as privateThread from "./privateThread/index";
export * as privateThread from "./privateThread/index";
import * as publicThread from "./publicThread/index";
export * as publicThread from "./publicThread/index";

export type Channels = {
  "announcementThread": announcementThread.AnnouncementThread;
  "dm": dm.Dm;
  "guildAnnouncement": guildAnnouncement.GuildAnnouncement;
  "guildText": guildText.GuildText;
  "privateThread": privateThread.PrivateThread;
  "publicThread": publicThread.PublicThread;
}
