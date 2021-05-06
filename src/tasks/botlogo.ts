import { bot, chooseRandom, editBotProfile } from "../../deps.ts";

bot.tasks.set(`botlogo`, {
  name: `botlogo`,
  interval: bot.constants.milliseconds.WEEK,
  execute: async function () {
    editBotProfile(undefined, chooseRandom(bot.constants.botLogos));
  },
});
