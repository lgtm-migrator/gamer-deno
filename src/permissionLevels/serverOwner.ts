import { cache } from "../../deps.ts";
import { bot } from "../../deps.ts";
import { PermissionLevels } from "../types/commands.ts";

// The member using the command must be an server owner.
bot.permissionLevels.set(PermissionLevels.SERVER_OWNER, async (message) => {
  const guild = cache.guilds.get(message.guildID);
  if (!guild) return false;

  return guild?.ownerID === message.author.id;
});
