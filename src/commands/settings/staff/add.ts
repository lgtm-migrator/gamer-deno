import { PermissionLevels } from "../../../types/commands.ts";
import { createSubcommand } from "../../../utils/helpers.ts";
import { bot, Role } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";

createSubcommand("settings-staff-mods", {
  name: "add",
  aliases: ["a"],
  permissionLevels: [PermissionLevels.ADMIN, PermissionLevels.SERVER_OWNER],
  arguments: [{ name: "role", type: "role" }] as const,
  execute: async function (message, args) {
    const settings = await bot.helpers.upsertGuild(message.guildID);
    if (!settings.modRoleIDs.includes(args.role.id)) {
      await db.guilds.update(message.guildID, {
        modRoleIDs: [...settings.modRoleIDs, args.role.id],
      });
    }

    return bot.helpers.reactSuccess(message);
  },
});
