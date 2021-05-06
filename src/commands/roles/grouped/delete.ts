import { bot } from "../../../../deps.ts";
import { createSubcommand } from "../../../utils/helpers.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { db } from "../../../database/database.ts";

createSubcommand("roles-grouped", {
  name: "delete",
  permissionLevels: [PermissionLevels.ADMIN],
  arguments: [{ name: "name", type: "string", lowercase: true }] as const,
  guildOnly: true,
  execute: async (message, args) => {
    const exists = await db.groupedrolesets.findOne({
      name: args.name,
      guildID: message.guildID,
    });
    if (!exists) return bot.helpers.reactError(message);

    // Create a roleset
    await db.groupedrolesets.deleteOne({
      name: args.name,
      guildID: message.guildID,
    });

    return bot.helpers.reactSuccess(message);
  },
});
