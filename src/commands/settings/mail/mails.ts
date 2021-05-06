import { bot } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("settings", {
  name: "mails",
  aliases: ["mail"],
  permissionLevels: [PermissionLevels.ADMIN],
  guildOnly: true,
  arguments: [{ name: "subcommand", type: "subcommand", required: false }] as const,
  execute: async (message) => {
    const settings = await db.guilds.get(message.guildID);
    if (!settings) return bot.helpers.reactError(message);

    return message.reply([`${settings.mailCategoryID}`].join("\n"));
  },
});
