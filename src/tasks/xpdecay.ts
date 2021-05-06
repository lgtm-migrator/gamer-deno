import { bot, cache } from "../../deps.ts";
import { db } from "../database/database.ts";

bot.tasks.set("xpdecay", {
  name: "xpdecay",
  interval: bot.constants.milliseconds.DAY,
  execute: async function () {
    bot.vipGuildIDs.forEach(async (guildID) => {
      const settings = await db.guilds.get(guildID);
      if (!settings?.xpDecayDays) return;

      for (const member of cache.members.values()) {
        if (member.guilds.has(guildID)) continue;

        // This user spoke today so not worth fetching his data
        if (bot.analyticsDetails.has(`${member.id}-${guildID}`)) continue;

        const xpData = await db.xp.get(`${guildID}-${member.id}`);
        if (!xpData) return;

        // If below 100XP do not decay
        if (xpData.xp < 100) return;

        // Calculate how many days it has been since this user was last updated
        const daysSinceLastUpdated = (Date.now() - xpData.lastUpdatedAt) / bot.constants.milliseconds.DAY;
        if (daysSinceLastUpdated < settings.xpDecayDays) return;

        // Remove 1% of XP from the user for being inactive today.
        bot.helpers.removeXP(guildID, member.id, Math.floor(((settings.decayPercentange || 1) / 1000) * xpData.xp));
      }
    });
  },
});
