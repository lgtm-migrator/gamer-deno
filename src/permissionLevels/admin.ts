import { bot, memberIDHasPermission } from "../../deps.ts";
import { db } from "../database/database.ts";
import { PermissionLevels } from "../types/commands.ts";

// The member using the command must be an admin. (Required ADMIN server perm.)
bot.permissionLevels.set(PermissionLevels.ADMIN, async (message) => {
  const hasAdminPerm = await memberIDHasPermission(message.author.id, message.guildID, ["ADMINISTRATOR"]);
  if (hasAdminPerm) return true;

  // If they lack the admin perms we can make a database call.
  const settings = await db.guilds.get(message.guildID);
  if (!settings) return false;

  return bot.helpers.isAdmin(message, settings);
});
