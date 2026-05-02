/* eslint-disable */
/* tslint:disable */
// This file is generated. Do not edit it manually.

export type Output = {
  /** Guild ID */
  id: string;
  /** Guild name */
  name: string;
  icon: /** Icon hash */ string | null;
  description: /** Guild description */ string | null;
  splash: /** Splash hash */ string | null;
  discoverySplash: /** Discovery splash hash */ string | null;
  /** Enabled guild features */
  features: string[];
  banner: /** Banner hash */ string | null;
  /** ID of the guild owner */
  ownerId: string;
  region?: /** Voice region ID (deprecated) */ string | null;
  afkChannelId: /** AFK channel ID */ string | null;
  /** AFK timeout in seconds */
  afkTimeout: number;
  /** Verification level required for the guild */
  verificationLevel: number;
  /** Default message notification level */
  defaultMessageNotifications: number;
  /** Required MFA level for the guild */
  mfaLevel: number;
  /** Explicit content filter level */
  explicitContentFilter: number;
  maxPresences?: /** Maximum number of presences */ number | null;
  /** Maximum number of members */
  maxMembers?: number;
  vanityUrlCode: /** Vanity URL code */ string | null;
  /** Premium tier (Server Boost level) */
  premiumTier: number;
  /** Number of boosts */
  premiumSubscriptionCount?: number;
  systemChannelId: /** System channel ID */ string | null;
  /** System channel flags */
  systemChannelFlags: number;
  rulesChannelId: /** Rules channel ID */ string | null;
  publicUpdatesChannelId: /** Public updates channel ID */ string | null;
  safetyAlertsChannelId?: /** Safety alerts channel ID */ string | null;
  /** Preferred locale */
  preferredLocale: string;
  /** Approximate number of members (only present when withCounts is true) */
  approximateMemberCount?: number;
  /** Approximate number of online members (only present when withCounts is true) */
  approximatePresenceCount?: number;
  roles: Array<{
    /** The role ID */
    id: string;
    /** The role's name */
    name: string;
    /** RGB color value of the role */
    color: number;
    /** Whether the role is displayed separately in the sidebar */
    hoist: boolean;
    /** The role's position in the hierarchy */
    position: number;
    /** Bitwise permissions value of the role */
    permissions: string;
    /** Whether the role can be mentioned */
    mentionable: boolean;
  }>;
};
