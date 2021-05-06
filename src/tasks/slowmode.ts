import { bot } from "../../deps.ts";

bot.tasks.set(`slowmode`, {
  name: `slowmode`,
  interval: bot.constants.milliseconds.MINUTE * 2,
  execute: async function () {
    const now = Date.now();
    bot.slowmode.forEach(async (timestamp, key) => {
      if (now > timestamp) return;
      bot.slowmode.delete(key);
    });
  },
});
