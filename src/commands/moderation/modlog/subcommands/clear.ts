import { bot } from "../../../../../deps.ts";
import { db } from "../../../../database/database.ts";
import { PermissionLevels } from "../../../../types/commands.ts";
import { createSubcommand } from "../../../../utils/helpers.ts";

createSubcommand("modlog", {
  name: "clear",
  permissionLevels: [PermissionLevels.ADMIN, PermissionLevels.MODERATOR],
  arguments: [{ name: "member", type: "member" }] as const,
  guildOnly: true,
  vipServerOnly: true,
  execute: async (message, args) => {
    await db.modlogs.deleteMany({
      guildID: message.guildID,
      userID: args.member.id,
    });

    return bot.helpers.reactSuccess(message);
  },
});
