import { bot, chooseRandom } from "../../deps.ts";
import { db } from "../database/database.ts";

// Randomly select 3 new missions every 30 minutes
bot.tasks.set("missions", {
  name: "missions",
  interval: bot.constants.milliseconds.MINUTE * 30,
  execute: async function () {
    // Remove all missions first before creating any new missions
    await db.mission.deleteMany({});

    bot.missionStartedAt = Date.now();

    // Find new random missions to use
    bot.missions = [];

    while (bot.missions.length < 5) {
      const randomMission = chooseRandom(bot.constants.missions);
      if (!bot.missions.find((m) => m.title === randomMission.title)) {
        bot.missions.push(randomMission);
      }
    }
  },
});
