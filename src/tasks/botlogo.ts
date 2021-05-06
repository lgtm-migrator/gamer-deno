import { chooseRandom, editBotProfile } from "../../deps.ts";
import { bot } from "../../cache.ts";

bot.tasks.set(`botlogo`, {
  name: `botlogo`,
  interval: bot.constants.milliseconds.WEEK,
  execute: async function () {
    editBotProfile(undefined, chooseRandom(bot.constants.botLogos));
  },
});
