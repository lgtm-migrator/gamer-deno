import { bgBlue, bgYellow, black, bot } from "../../deps.ts";
import { getTime } from "../utils/helpers.ts";

bot.monitors.set("xp", {
  name: "xp",
  execute: async function (message) {
    // If a bot or in dm, no XP we want to encourage activity in servers not dms
    if (message.author.bot || !message.guildID) return;

    // DISABLED XP
    if (!bot.xpEnabledGuildIDs.has(message.guildID)) return;

    console.log(`${bgBlue(`[${getTime()}]`)} => [MONITOR: ${bgYellow(black("supportactivity"))}] Started.`);

    // Update XP for the member locally
    await bot.helpers.addLocalXP(message.guildID, message.author.id, bot.guildsXPPerMessage.get(message.guildID) || 1);

    // Update XP for the user globally
    await bot.helpers.addGlobalXP(
      message.author.id,
      bot.vipUserIDs.has(message.author.id) && bot.vipGuildIDs.has(message.guildID)
        ? 5
        : bot.vipUserIDs.has(message.author.id)
        ? 3
        : bot.vipGuildIDs.has(message.guildID)
        ? 2
        : 1
    );
  },
});
