import { bot } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("roles-required", {
  name: "create",
  permissionLevels: [PermissionLevels.ADMIN],
  arguments: [
    { name: "name", type: "string", lowercase: true },
    { name: "requiredRole", type: "role" },
    { name: "roles", type: "...roles" },
  ] as const,
  guildOnly: true,
  vipServerOnly: true,
  execute: async (message, args) => {
    const exists = await db.requiredrolesets.findOne({
      name: args.name,
      guildID: message.guildID,
    });
    if (exists) return bot.helpers.reactError(message);

    // Create a roleset
    await db.requiredrolesets.create(message.id, {
      id: message.id,
      name: args.name,
      requiredRoleID: args.requiredRole.id,
      roleIDs: args.roles.map((role) => role.id),
      guildID: message.guildID,
    });

    return bot.helpers.reactSuccess(message);
  },
});
