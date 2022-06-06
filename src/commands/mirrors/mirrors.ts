import { Gamer } from "../../../bot.ts";
import { db } from "../../database/database.ts";
import { createCommand, PermissionLevels } from "../../helpers/commands.ts";

createCommand({
  name: "mirrors",
  arguments: [
    {
      name: "subcommand",
      type: "subcommand",
      required: false,
    },
  ] as const,
  permissionLevels: [PermissionLevels.ADMIN],
  execute: async (message) => {
    const mirrors = await db.mirrors.findMany(
      (value) => value.sourceGuildID === message.guildId?.toString() || value.mirrorGuildID === message.guildId?.toString(),
      true
    );
    if (!mirrors?.length) {
      return await Gamer.helpers.sendTextMessage(
        message.channelId,
        "No mirrors found in the database for this server."
      );
    }

    return await Gamer.helpers.sendTextMessage(
      message.channelId,
      mirrors.map((mirror) => `<#${mirror.sourceChannelID}> => <#${mirror.mirrorChannelID}>`).join("\n")
    );
  },
});
