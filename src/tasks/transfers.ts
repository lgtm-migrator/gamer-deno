import { bot } from "../../deps.ts";

bot.tasks.set("transfers", {
  name: "transfers",
  interval: bot.constants.milliseconds.DAY,
  execute: async function () {
    bot.transferLog.clear();
  },
});
