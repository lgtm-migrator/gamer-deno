import { bot } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { createCommand, sendEmbed } from "../../../utils/helpers.ts";

createCommand({
  name: "spy",
  vipServerOnly: true,
  arguments: [{ name: "subcommand", type: "subcommand", required: false }],
  cooldown: {
    seconds: 60,
  },
  execute: async function (message) {
    const spyRecords = await db.spy.get(message.author.id);
    if (!spyRecords) return bot.helpers.reactError(message);

    const embed = bot.helpers.authorEmbed(message).setDescription(spyRecords.words.join(", ")).setTimestamp();

    const words = await sendEmbed(message.channelID, embed);
    if (words) {
      await words.delete(undefined, bot.constants.milliseconds.MINUTE);
    }
  },
});
