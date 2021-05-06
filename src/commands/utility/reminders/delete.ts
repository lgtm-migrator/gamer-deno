import { createSubcommand } from "../../../utils/helpers.ts";
import { bot } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";

createSubcommand("remind", {
  name: "delete",
  cooldown: {
    seconds: 120,
    allowedUses: 2,
  },
  guildOnly: true,
  arguments: [{ name: "id", type: "snowflake" }] as const,
  execute: async (message, args) => {
    const reminder = await db.reminders.get(args.id);
    if (reminder?.memberID !== message.author.id) {
      return bot.helpers.reactError(message);
    }

    await db.reminders.delete(args.id);
    return bot.helpers.reactSuccess(message);
  },
});
