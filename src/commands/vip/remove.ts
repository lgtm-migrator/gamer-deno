import { bot } from "../../../deps.ts";
import { db } from "../../database/database.ts";
import { PermissionLevels } from "../../types/commands.ts";
import { createSubcommand } from "../../utils/helpers.ts";

createSubcommand("vip", {
  name: "remove",
  guildOnly: true,
  cooldown: {
    seconds: 120,
    allowedUses: 2,
  },
  permissionLevels: [PermissionLevels.SERVER_OWNER],
  execute: async function (message) {
    // The Server is not VIP
    if (!bot.vipGuildIDs.has(message.guildID)) return bot.helpers.reactError(message);
    const guildSettings = await db.vipGuilds.get(message.guildID);
    if (!guildSettings) return bot.helpers.reactError(message);
    const userSettings = await db.vipUsers.get(guildSettings.userID);
    if (!userSettings) return bot.helpers.reactError(message);
    await db.vipUsers.update(guildSettings.userID, {
      guildIDs: userSettings.guildIDs.filter((id) => id !== message.guildID),
    });
    await db.vipGuilds.delete(message.guildID);
    bot.vipGuildIDs.delete(message.guildID);

    return bot.helpers.reactSuccess(message);
  },
});
