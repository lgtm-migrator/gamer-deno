import { bot, cache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("tag", {
  name: "install",
  aliases: ["i", "d", "download"],
  guildOnly: true,
  permissionLevels: [PermissionLevels.ADMIN],
  arguments: [{ name: "module", type: "string", lowercase: true }] as const,
  execute: async function (message, args) {
    // Check the module and convert it to a server id
    const serverID = bot.modules.get(args.module) || args.module;
    // Validate it is a guild id
    if (!cache.guilds.has(serverID)) {
      return bot.helpers.reactError(message);
    }
    // Add this module to the database
    await db.modules.update(`${message.guildID}-${serverID}`, {
      sourceGuildID: serverID,
      guildID: message.guildID,
    });
    // Alerts the user that it was completed
    return bot.helpers.reactSuccess(message);
  },
});
