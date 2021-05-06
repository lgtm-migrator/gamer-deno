import { bot } from "../../deps.ts";

bot.tasks.set(`supportactivity`, {
  name: `supportactivity`,
  interval: bot.constants.milliseconds.DAY,
  execute: async function () {
    bot.activeMembersOnSupportServer.clear();
  },
});
