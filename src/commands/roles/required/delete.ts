import { bot } from "../../../../deps.ts";
import { createSubcommand } from "../../../utils/helpers.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { db } from "../../../database/database.ts";

createSubcommand("roles-required", {
  name: "delete",
  permissionLevels: [PermissionLevels.ADMIN],
  arguments: [{ name: "name", type: "string", lowercase: true }],
  guildOnly: true,
  vipServerOnly: true,
  execute: async (message, args) => {
    const exists = await db.requiredrolesets.findOne({
      name: args.name,
      guildID: message.guildID,
    });
    if (!exists) return bot.helpers.reactError(message);

    // Create a roleset
    await db.requiredrolesets.deleteOne({
      name: args.name,
      guildID: message.guildID,
    });

    return bot.helpers.reactSuccess(message);
  },
});
