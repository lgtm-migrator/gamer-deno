import { botCache } from "../../../../mod.ts";
import { Role, addReaction } from "../../../../deps.ts";
import { createSubcommand } from "../../../utils/helpers.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { uniqueRoleSetsDatabase } from "../../../database/schemas/uniquerolesets.ts";

createSubcommand("roles-unique", {
  name: "create",
  permissionLevels: [PermissionLevels.ADMIN],
  arguments: [
    { name: "name", type: "string", lowercase: true },
    { name: "roles", type: "...roles" },
  ],
  guildOnly: true,
  execute: async (message, args: RoleUniqueCreateArg) => {
    const exists = await uniqueRoleSetsDatabase.findOne({
      name: args.name,
      guildID: message.guildID,
    });
    if (exists) return addReaction(message.channelID, message.id, "❌");

    // Create a roleset
    await uniqueRoleSetsDatabase.insertOne({
      name: args.name,
      roleIDs: args.roles.map((role) => role.id),
      guildID: message.guildID,
    });

    return addReaction(
      message.channelID,
      message.id,
      botCache.constants.emojis.success,
    );
  },
});

interface RoleUniqueCreateArg {
  name: string;
  roles: Role[];
}
