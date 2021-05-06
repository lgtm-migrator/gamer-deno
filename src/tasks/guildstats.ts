import { configs } from "../../configs.ts";
import { bot, cache, sendMessage } from "../../deps.ts";
import { Embed } from "../utils/Embed.ts";

bot.tasks.set(`guildstats`, {
  name: `guildstats`,
  // Runs this function once an day
  interval: bot.constants.milliseconds.DAY,
  execute: async function () {
    // Only run when the bot is fully ready. In case guilds are still loading dont want to send wrong stats.
    if (!bot.fullyReady) return;

    const totalGuilds = (cache.guilds.size + bot.dispatchedGuildIDs.size).toLocaleString("en-US");

    const embed = new Embed().setTitle("DAILY STATS").addField("SERVERS", totalGuilds, true).setTimestamp();

    await sendMessage(configs.channelIDs.serverStats, { embed }).catch(console.log);
  },
});
