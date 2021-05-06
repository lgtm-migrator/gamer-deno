import { bot } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("roles-grouped", {
  name: "create",
  permissionLevels: [PermissionLevels.ADMIN],
  arguments: [
    { name: "name", type: "string", lowercase: true },
    { name: "mainRole", type: "role" },
    { name: "roles", type: "...roles" },
  ] as const,
  vipServerOnly: true,
  guildOnly: true,
  execute: async (message, args) => {
    const exists = await db.groupedrolesets.findOne({
      name: args.name,
      guildID: message.guildID,
    });
    if (exists) return bot.helpers.reactError(message);

    // Create a roleset
    await db.groupedrolesets.create(message.id, {
      id: message.id,
      name: args.name,
      roleIDs: args.roles.map((role) => role.id),
      guildID: message.guildID,
      mainRoleID: args.mainRole.id,
    });

    return bot.helpers.reactSuccess(message);
  },
});
