import { bot, getAuditLogs, Guild, guildIconURL, rawAvatarURL, UserPayload } from "../../deps.ts";
import { db } from "../database/database.ts";
import { Embed } from "../utils/Embed.ts";
import { sendEmbed } from "../utils/helpers.ts";
import { translate } from "../utils/i18next.ts";

bot.eventHandlers.guildBanAdd = async function (guild, user) {
  handleBanServerLogs(guild, user, "add").catch(console.log);
};

bot.eventHandlers.guildBanRemove = async (guild, user) => {
  handleBanServerLogs(guild, user, "remove").catch(console.log);
};

async function handleBanServerLogs(guild: Guild, user: UserPayload, type: "add" | "remove") {
  const logs = bot.recentLogs.has(guild.id) ? bot.recentLogs.get(guild.id) : await db.serverlogs.get(guild.id);
  bot.recentLogs.set(guild.id, logs);
  // LOGS ARE DISABLED
  if (!logs?.banAddChannelID) return;

  const userTag = `${user.username}#${user.discriminator}`;

  const texts = [
    translate(guild.id, type === "add" ? "strings:USER_BANNED" : "strings:USER_UNBANNED"),
    translate(guild.id, "strings:USER", { tag: userTag, id: user.id }),
    translate(guild.id, "strings:TOTAL_USERS", { amount: guild.memberCount }),
  ];

  const embed = new Embed()
    .setDescription(texts.join("\n"))
    .setFooter(userTag, guildIconURL(guild))
    .setColor(type === "add" ? bot.constants.brand.BAN_COLOR : bot.constants.brand.UNBAN_COLOR)
    .setThumbnail(rawAvatarURL(user.id, user.discriminator, user.avatar))
    .setTimestamp();

  // NO VIP GET BASIC DATA ONLY
  if (!bot.vipGuildIDs.has(guild.id)) {
    return sendEmbed(type === "add" ? logs.banAddChannelID : logs.banRemoveChannelID, embed);
  }

  // PUBLIC EMBED
  if (logs.banAddPublic) {
    await sendEmbed(type === "add" ? logs.banAddChannelID : logs.banRemoveChannelID, embed);
  }

  // WAIT FEW SECONDS TO ALLOW AUDIT LOGS AVAILABLE
  const auditlogs = await getAuditLogs(guild.id, {
    action_type: type === "add" ? "MEMBER_BAN_ADD" : "MEMBER_BAN_REMOVE",
  }).catch(console.log);

  // IF A LOG WAS NOT FOUND, POST NORMAL EMBED
  const relevant = auditlogs?.audit_log_entries.find((e: any) => e.target_id === user.id);
  if (!relevant) {
    return sendEmbed(type === "add" ? logs.banAddChannelID : logs.banRemoveChannelID, embed);
  }

  // OLD BAN
  if (Date.now() - bot.helpers.snowflakeToTimestamp(relevant.id) > 3000) {
    return sendEmbed(type === "add" ? logs.banAddChannelID : logs.banRemoveChannelID, embed);
  }

  const mod = auditlogs.users.find((u: any) => u.id === relevant.user_id);
  if (mod) {
    embed.setAuthor(
      `${mod.username}#${mod.discriminator} (${mod.id})`,
      rawAvatarURL(mod.id, mod.discriminator, mod.avatar)
    );
  }
  if (relevant.reason) {
    texts.push(translate(guild.id, "strings:REASON", { reason: relevant.reason }));
  }

  embed.setDescription(texts.join("\n"));

  return sendEmbed(type === "add" ? logs.banAddChannelID : logs.banRemoveChannelID, embed);
}
