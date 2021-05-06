import { bot } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("spy", {
  name: "remove",
  aliases: ["r"],
  vipServerOnly: true,
  arguments: [{ name: "word", type: "string", lowercase: true }] as const,
  execute: async function (message, args) {
    const records = bot.spyRecords.get(args.word);
    const details = await db.spy.get(message.author.id);

    // Just incase it was in the db remove it
    if (details?.words.includes(args.word)) {
      await db.spy.update(message.author.id, {
        words: details.words.filter((w) => w !== args.word),
      });
    }

    // This word wasnt being followed
    if (!records?.includes(message.author.id)) {
      return bot.helpers.reactSuccess(message);
    }

    // Removing the word
    bot.spyRecords.set(
      args.word,
      records.filter((id) => id !== message.author.id)
    );

    return bot.helpers.reactSuccess(message);
  },
});
