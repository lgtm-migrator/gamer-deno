import { bot } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("settings", {
  name: "counting",
  arguments: [
    { name: "channel", type: "guildtextchannel" },
    { name: "role", type: "role" },
  ] as const,
  guildOnly: true,
  vipServerOnly: true,
  permissionLevels: [PermissionLevels.ADMIN],
  execute: async (message, args) => {
    await db.counting.update(args.channel.id, {
      guildID: message.guildID,
      loserRoleID: args.role.id,
      localOnly: true,
      deleteInvalid: bot.vipGuildIDs.has(message.guildID),
      count: 0,
      buffs: [],
      debuffs: [],
    });
    return bot.helpers.reactSuccess(message);
  },
});
