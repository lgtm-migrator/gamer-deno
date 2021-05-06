import { bot, cache, memberIDHasPermission } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("settings-logs", {
  name: "automod",
  description: "https://gamer.mod.land/docs/logs.html",
  permissionLevels: [PermissionLevels.ADMIN],
  arguments: [
    { name: "channel", type: "guildtextchannel", required: false },
    { name: "channelID", type: "snowflake", required: false },
  ] as const,
  execute: async function (message, args) {
    if (args.channel && !args.channel.nsfw) {
      return bot.helpers.reactError(message);
    }

    if (args.channelID) {
      // If a snowflake is provided make sure this is a vip server
      if (!bot.vipGuildIDs.has(message.guildID)) {
        return bot.helpers.reactError(message, true);
      }
      const channel = cache.channels.get(args.channelID);
      if (!channel?.nsfw) return bot.helpers.reactError(message);

      // VIP's can set channel ids from other server, make sure the user is an admin on other server
      if (!(await memberIDHasPermission(message.author.id, channel.guildID, ["ADMINISTRATOR"]))) {
        return bot.helpers.reactError(message);
      }

      await db.serverlogs.update(message.guildID, {
        automodChannelID: args.channelID,
      });
      return bot.helpers.reactSuccess(message);
    }

    await db.serverlogs.update(message.guildID, {
      automodChannelID: args.channel?.id || "",
    });
    return bot.helpers.reactSuccess(message);
  },
});
