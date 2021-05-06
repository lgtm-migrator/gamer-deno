import {
  addReaction,
  bot,
  botHasChannelPermissions,
  cache,
  Collection,
  deleteMessage,
  fetchMembers,
  Member,
  memberIDHasPermission,
  sendMessage,
} from "../../deps.ts";
import { sendResponse } from "../utils/helpers.ts";
import { translate } from "../utils/i18next.ts";

bot.helpers.isModOrAdmin = async (message, settings) => {
  const guild = cache.guilds.get(message.guildID);
  if (!guild) return false;

  const member = cache.members.get(message.author.id)?.guilds.get(message.guildID);
  if (!member) return false;

  if (await bot.helpers.isAdmin(message, settings)) return true;
  if (!settings) return false;

  return settings.modRoleIDs?.some((id) => member.roles.includes(id));
};

bot.helpers.isAdmin = async (message, settings) => {
  const guild = cache.guilds.get(message.guildID);
  if (!guild) return false;

  const member = cache.members.get(message.author.id)?.guilds.get(message.guildID);
  if (!member) return false;
  const hasAdminPerm = await memberIDHasPermission(message.author.id, message.guildID, ["ADMINISTRATOR"]);
  if (hasAdminPerm) return true;

  return settings?.adminRoleID ? member.roles.includes(settings.adminRoleID) : false;
};

bot.helpers.snowflakeToTimestamp = function (id) {
  return Math.floor(Number(id) / 4194304) + 1420070400000;
};

bot.helpers.reactError = async function (message, vip = false, text?: string) {
  if (vip) {
    await sendResponse(message, translate(message.guildID, "strings:NEED_VIP")).catch(console.log);
  }

  if (text) {
    await message.reply(text).catch(console.log);
  }

  await addReaction(message.channelID, message.id, "❌")
    .then(async () => {
      const reaction = await bot.helpers.needReaction(message.author.id, message.id);
      if (reaction === "❌") {
        const details = [
          "",
          "",
          "**__Debug/Diagnose Data:__**",
          "",
          `**Message ID:** ${message.id}`,
          `**Channel ID:** ${message.channelID}`,
          `**Server ID:** ${message.guildID}`,
          `**User ID:** ${message.author.id}`,
        ];
        await sendResponse(
          message,
          translate(message.guildID, "strings:NEED_HELP_ERROR", {
            invite: bot.constants.botSupportInvite,
            details: details.join("\n"),
          })
        ).catch(console.log);
      }
    })
    .catch(console.log);
};

bot.helpers.reactSuccess = function (message) {
  return addReaction(message.channelID, message.id, bot.constants.emojis.success).catch(console.log);
};

bot.helpers.emojiReaction = function (emoji) {
  const animated = emoji.startsWith("<a:");
  return `${animated ? "a:" : ""}${emoji.substring(animated ? 3 : 2, emoji.lastIndexOf(":"))}:${bot.helpers.emojiID(
    emoji
  )}`;
};

bot.helpers.emojiID = function (emoji) {
  if (!emoji.startsWith("<")) return;
  return emoji.substring(emoji.lastIndexOf(":") + 1, emoji.length - 1);
};

bot.helpers.emojiUnicode = function (emoji) {
  return emoji.animated || emoji.id ? `<${emoji.animated ? "a" : ""}:${emoji.name}:${emoji.id}>` : emoji.name || "";
};

bot.helpers.moveMessageToOtherChannel = async function (message, channelID) {
  const channel = cache.channels.get(channelID);
  if (!channel) return;

  if (!(await botHasChannelPermissions(channelID, ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"]))) {
    return;
  }

  const newMessage = await sendMessage(channel.id, {
    content: message.content,
    embed: message.embeds[0],
  });
  if (!newMessage) return;

  await deleteMessage(message);
  return newMessage;
};

bot.helpers.fetchMember = async function (guildID, id) {
  // Dumb ts shit on array destructuring https://github.com/microsoft/TypeScript/issues/13778
  if (!id) return;

  const userID = id.startsWith("<@") ? id.substring(id.startsWith("<@!") ? 3 : 2, id.length - 1) : id;

  const guild = cache.guilds.get(guildID);
  if (!guild) return;

  const cachedMember = cache.members.get(userID);
  if (cachedMember) return cachedMember;

  // When gateway is dying
  // return getMember(guildID, id);

  // Fetch from gateway as it is much better than wasting limited HTTP calls.
  const member = await fetchMembers(guild, { userIDs: [userID] }).catch(() => undefined);
  return member?.first();
};

bot.helpers.fetchMembers = async function (guildID, ids) {
  const userIDs = ids.map((id) =>
    id.startsWith("<@") ? id.substring(id.startsWith("<@!") ? 3 : 2, id.length - 1) : id
  );

  const guild = cache.guilds.get(guildID);
  if (!guild) return;

  const members = new Collection<string, Member>();

  for (const userID of userIDs) {
    const cachedMember = cache.members.get(userID);
    if (cachedMember?.guilds.has(guildID)) members.set(userID, cachedMember);
  }

  const uncachedIDs = userIDs.filter((id) => !members.has(id));
  if (members.size === ids.length || !uncachedIDs.length) return members;

  // Fetch from gateway as it is much better than wasting limited HTTP calls.
  const remainingMembers = await fetchMembers(guild, {
    userIDs: uncachedIDs,
  }).catch(console.log);

  if (!remainingMembers) return members;

  for (const member of remainingMembers.values()) {
    members.set(member.id, member);
  }

  return members;
};

bot.helpers.memberTag = function (message) {
  const member = cache.members.get(message.author.id);
  if (member) return member.tag;

  return `${message.author.username}#${message.author.discriminator}`;
};

bot.helpers.booleanEmoji = function (bool: boolean) {
  return bool ? bot.constants.emojis.success : bot.constants.emojis.failure;
};
