import { configs } from "../../configs.ts";
import { bot } from "../../deps.ts";
import { db } from "../database/database.ts";

bot.helpers.upsertGuild = async function (id: string) {
  const settings = await db.guilds.get(id);
  if (settings) return settings;

  // Create a new settings for this guild.
  await db.guilds.create(id, {
    id,
    prefix: configs.prefix,
    tenorEnabled: true,
    xpEnabled: false,
    language: "",
    missionsDisabled: false,
    xpDecayDays: 0,
    decayPercentange: 0,
    xpPerMessage: 1,
    xpPerMinuteVoice: 1,
    allowedBackgroundURLs: [],
    showMarriage: true,
    disabledXPChannelIDs: [],
    disabledXPRoleIDs: [],
    eventsAdvertiseChannelID: "",
    adminRoleID: "",
    modRoleIDs: [],
    logsGuildID: "",
    autoembedChannelIDs: [],
    todoBacklogChannelID: "",
    todoCurrentSprintChannelID: "",
    todoNextSprintChannelID: "",
    todoArchivedChannelID: "",
    todoCompletedChannelID: "",
    mailsEnabled: false,
    mailsRoleIDs: [],
    mailsGuildID: "",
    mailsLogChannelID: "",
    mailsRatingsChannelID: "",
    mailCategoryID: "",
    mailAutoResponse: "",
    mailQuestions: [],
    mailsSupportChannelID: "",
    approvalChannelID: "",
    solvedChannelID: "",
    rejectedChannelID: "",
    solvedMessage: "",
    rejectedMessage: "",
    feedbackLogChannelID: "",
    ideaChannelID: "",
    ideaQuestions: [],
    bugsChannelID: "",
    bugsQuestions: [],
    publicRoleIDs: [],
    muteRoleID: "",
    capitalPercentage: 100,
    profanityEnabled: false,
    profanityWords: [],
    profanityStrictWords: [],
    profanityPhrases: [],
    linksEnabled: false,
    linksChannelIDs: [],
    linksUserIDs: [],
    linksRoleIDs: [],
    linksURLs: [],
    linksRestrictedURLs: [],
    verifyCategoryID: "",
    verifyEnabled: false,
    verifyRoleID: "",
    verifyChannelIDs: [],
    firstMessageJSON: "",
    userAutoRoleID: "",
    botsAutoRoleID: "",
    discordVerificationStrictnessEnabled: true,
    disabledTagChannelIDs: [],
    analyticsChannelID: "",
    createEventsRoleID: "",
  });

  const guild = await db.guilds.get(id);
  return guild!;
};
