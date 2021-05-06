import { bot } from "../../../../../deps.ts";
import { db } from "../../../../database/database.ts";
import { PermissionLevels } from "../../../../types/commands.ts";
import { createSubcommand } from "../../../../utils/helpers.ts";

createSubcommand("settings-mails", {
  name: "supportchannel",
  aliases: ["mailchannel", "sc", "mc"],
  permissionLevels: [PermissionLevels.ADMIN],
  arguments: [
    {
      name: "enable",
      type: "boolean",
      defaultValue: true,
    },
    { name: "channel", type: "guildtextchannel", required: false },
  ] as const,
  execute: async function (message, args) {
    const settings = await db.guilds.get(message.guildID);
    if (!settings || !settings.mailsEnabled) return bot.helpers.reactError(message);

    db.guilds.update(message.guildID, {
      mailsSupportChannelID: args.enable ? args.channel?.id ?? message.channelID : "",
    });

    bot.guildSupportChannelIDs.delete(settings.mailsSupportChannelID);
    if (args.enable) bot.guildSupportChannelIDs.add(args.channel?.id ?? message.channelID);

    return bot.helpers.reactSuccess(message);
  },
});
