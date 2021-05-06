import { botID, cache, leaveGuild } from "../../deps.ts";
import { db } from "../database/database.ts";
import { bot } from "../../cache.ts";

bot.tasks.set("enterprise", {
  name: "enterprise",
  interval: bot.constants.milliseconds.MINUTE * 5,
  execute: async function () {
    // PUBLIC BOT SKIP
    if (botID === "270010330782892032") return;

    // ENTERPRISE SERVERS FOR THIS BOT
    const enterprise = await db.enterprise.get(botID);
    if (!enterprise) return;

    // LEAVE ANY THAT ARENT PART OF THIS PACKAGE
    cache.guilds.forEach(async (guild) => {
      // KEEP SUPPORT SERVER IN CASE WE NEED
      if (guild.id === bot.constants.botSupportServerID) return;
      if (!enterprise.guildIDs.includes(guild.id)) {
        leaveGuild(guild.id).catch(console.log);
      }
    });
  },
});
