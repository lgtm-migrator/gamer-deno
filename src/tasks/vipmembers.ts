import { bot, cache, fetchMembers } from "../../deps.ts";

bot.tasks.set("vipmembers", {
  name: "vipmembers",
  interval: bot.constants.milliseconds.HOUR,
  execute: async function () {
    bot.vipGuildIDs.forEach(async (id) => {
      const guild = cache.guilds.get(id);
      if (!guild) return;

      const cachedMembers = cache.members.filter((m) => m.guilds.has(id));
      // ALL MEMBERS ARE ALREADY CACHED
      if (guild.memberCount === cachedMembers.size) return;

      // FETCH MEMBERS TO MAKE SURE WE NOT MISSING ANY
      await fetchMembers(guild).catch(console.log);
    });
  },
});
