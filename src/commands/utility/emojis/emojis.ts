import { bot } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { createCommand } from "../../../utils/helpers.ts";

createCommand({
  name: "emojis",
  arguments: [{ name: "subcommand", type: "subcommand" }],
  execute: async function (message) {
    const emojis = await db.emojis.findMany({ userID: message.author.id }, true);
    if (!emojis?.length) return bot.helpers.reactError(message);

    await message.send({
      content: emojis.map((emoji) => `${emoji.fullCode} **${emoji.name}**`).join("\n"),
      mentions: { parse: [] },
    });
  },
});
