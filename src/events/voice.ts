import { bot, cache, guildIconURL, Member } from "../../deps.ts";
import { db } from "../database/database.ts";
import { Embed } from "../utils/Embed.ts";
import { sendEmbed } from "../utils/helpers.ts";
import { translate } from "../utils/i18next.ts";

bot.eventHandlers.voiceChannelJoin = async function (member, channelID) {
  if (member.bot) return;

  const channel = cache.channels.get(channelID);
  if (!channel) return;

  // Voice XP is vip guilds only
  if (!bot.vipGuildIDs.has(channel.guildID)) return;
  handleServerLogs(channel.guildID, member, channel.id, "joined").catch(console.log);

  await db.xp.update(`${channel.guildID}-${member.id}`, {
    joinedVoiceAt: Date.now(),
  });
};

bot.eventHandlers.voiceChannelLeave = async function (member, channelID) {
  if (!member) return;

  if (member.bot) return;

  const channel = cache.channels.get(channelID);
  if (!channel) return;

  const guild = cache.guilds.get(channel.guildID);
  if (!guild) return;

  if (!bot.vipGuildIDs.has(channel.guildID)) return;
  handleServerLogs(guild.id, member, channel.id, "left").catch(console.log);

  const settings = await db.xp.get(`${channel.guildID}-${member.id}`);
  if (!settings?.joinedVoiceAt) return;

  // If the joined channel is the afk channel ignore.
  if (channelID === guild.afkChannelID) {
    return db.xp.update(`${channel.guildID}-${member.id}`, {
      joinedVoiceAt: 0,
    });
  }

  // Calculate the amount of total minutes spent in this voice channel
  const totalMinutesInVoice = Math.round((Date.now() - settings.joinedVoiceAt) / 1000 / 60);
  const guildXPMultiplier = bot.guildsXPPerMinuteVoice.get(channel.guildID);

  // Update voice xp to the guild
  await db.xp.update(`${channel.guildID}-${member.id}`, {
    joinedVoiceAt: 0,
    voiceXP: totalMinutesInVoice * (guildXPMultiplier || 1),
  });

  // If more than 10 minutes they have fulfilled the mission
  if (totalMinutesInVoice >= 10) {
    bot.helpers.completeMission(channel.guildID, member.id, `voice10min`);
  }
};

bot.eventHandlers.voiceChannelSwitch = async function (member, channelID, oldChannelID) {
  bot.eventHandlers.voiceChannelLeave?.(member, oldChannelID);
  bot.eventHandlers.voiceChannelJoin?.(member, channelID);
};

async function handleServerLogs(guildID: string, member: Member, channelID: string, type: "joined" | "left") {
  const guild = cache.guilds.get(guildID);
  const channel = cache.channels.get(channelID);
  if (!channel || !guild) return;

  const logs = bot.recentLogs.has(guild.id) ? bot.recentLogs.get(guild.id) : await db.serverlogs.get(guildID);
  bot.recentLogs.set(guildID, logs);
  // DISABELD LOGS
  if (!logs) return;
  if ((type === "joined" && !logs.voiceJoinChannelID) || logs.voiceJoinIgnoredChannelIDs?.includes(channelID)) {
    return;
  }
  if ((type === "left" && !logs.voiceLeaveChannelID) || logs.voiceLeaveIgnoredChannelIDs?.includes(channelID)) {
    return;
  }

  const texts = [
    translate(guildID, type === "joined" ? "strings:JOINED_VOICE" : "strings:LEFT_VOICE"),
    translate(guild.id, "strings:USER", {
      tag: `<@!${member.id}>`,
      id: member.id,
    }),
    translate(guildID, "strings:TOTAL_USERS", {
      amount: guild?.voiceStates.filter((vs) => vs.channelID === channelID).size || type === "joined" ? 1 : 0,
    }),
    translate(guildID, "strings:LOGS_CHANNEL", {
      name: channel.name,
      id: channel.id,
    }),
    translate(guildID, "strings:MAX_LIMIT", {
      amount: !channel.userLimit || channel.userLimit === 0 ? "♾️" : channel.userLimit,
    }),
  ];
  const embed = new Embed()
    .setAuthor(member.tag, member.avatarURL)
    .setDescription(texts.join("\n"))
    .setFooter(member.tag, guildIconURL(guild))
    .setThumbnail(member.avatarURL)
    .setTimestamp();

  if (type === "joined" && logs.voiceJoinPublic) {
    await sendEmbed(logs.publicChannelID, embed);
  }
  if (type === "left" && logs.voiceLeavePublic) {
    await sendEmbed(logs.publicChannelID, embed);
  }
  return sendEmbed(type === "joined" ? logs.voiceJoinChannelID : logs.voiceLeaveChannelID, embed);
}
