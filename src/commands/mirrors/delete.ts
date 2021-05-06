import { bot } from "../../../deps.ts";
import { db } from "../../database/database.ts";
import { createSubcommand } from "../../utils/helpers.ts";

createSubcommand("mirrors", {
  name: "delete",
  arguments: [{ name: "channel", type: "guildtextchannel" }] as const,
  execute: async (message, args) => {
    const mirrors = bot.mirrors.get(message.channelID);
    if (!mirrors) {
      return bot.helpers.reactError(message);
    }

    if (mirrors.length === 1) {
      bot.mirrors.delete(message.channelID);
      await db.mirrors.deleteMany({ sourceChannelID: message.channelID });
    } else {
      const otherMirrors = mirrors.filter((mirror) => mirror.mirrorChannelID !== args.channel.id);
      if (!otherMirrors.length) {
        bot.mirrors.delete(message.channelID);
        await db.mirrors.deleteMany({ sourceChannelID: message.channelID });
      } else {
        bot.mirrors.set(message.channelID, otherMirrors);
        await db.mirrors.deleteMany({
          sourceChannelID: message.channelID,
          mirrorChannelID: args.channel.id,
        });
      }
    }

    return bot.helpers.reactSuccess(message);
  },
});
