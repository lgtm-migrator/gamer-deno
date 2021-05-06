import { bot } from "../../../deps.ts";
import { db } from "../../database/database.ts";
import { PermissionLevels } from "../../types/commands.ts";
import { createSubcommand } from "../../utils/helpers.ts";

createSubcommand("settings", {
  name: "tenor",
  permissionLevels: [PermissionLevels.ADMIN],
  guildOnly: true,
  arguments: [{ name: "enable", type: "boolean" }] as const,
  execute: async (message, args) => {
    await db.guilds.update(message.guildID, { tenorEnabled: args.enable });

    if (!args.enable) bot.tenorDisabledGuildIDs.add(message.guildID);
    else bot.tenorDisabledGuildIDs.delete(message.guildID);

    return bot.helpers.reactSuccess(message);
  },
});
