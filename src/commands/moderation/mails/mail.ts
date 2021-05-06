import { bot } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { createCommand } from "../../../utils/helpers.ts";

createCommand({
  name: "mail",
  aliases: ["mails", "m"],
  arguments: [
    { name: "subcommand", type: "subcommand", required: false },
    { name: "content", type: "...string", required: false },
  ] as const,
  cooldown: {
    seconds: 5,
    allowedUses: 2,
  },
  execute: async (message, args, guild) => {
    if (!args.content && !message.attachments.length) return bot.helpers.reactError(message);
    if (!args.content) args.content = "";

    if (!message.guildID) {
      return bot.helpers.mailHandleDM(message, args.content);
    }

    const settings = await bot.helpers.upsertGuild(message.guildID);
    if (!settings?.mailsEnabled) return bot.helpers.reactError(message);

    if (!bot.helpers.isModOrAdmin(message, settings)) {
      return bot.helpers.mailHandleSupportChannel(message, args.content);
    }

    const mail = await db.mails.get(message.channelID);
    if (!mail) {
      return bot.helpers.mailHandleSupportChannel(message, args.content);
    }

    // @ts-ignore
    return bot.commands.get("mail")?.subcommands?.get("reply")?.execute?.(message, args, guild);
  },
});
