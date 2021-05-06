import { bot } from "../../deps.ts";

bot.tasks.set(`pm2`, {
  name: `pm2`,
  interval: bot.constants.milliseconds.MINUTE * 30,
  execute: async function () {
    Deno.run({ cmd: ["pm2", "flush"] });
  },
});
