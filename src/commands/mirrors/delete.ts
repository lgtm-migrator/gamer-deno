import { Gamer } from "../../../bot.ts";
import { db } from "../../database/database.ts";
import { createSubcommand } from "../../helpers/commands.ts";
import { reactSuccess } from "../../helpers/reactions.ts";

createSubcommand("mirrors", {
  name: "delete",
  arguments: [{ name: "channel", type: "guildtextchannel" }] as const,
  execute: async (message, args) => {
    const mirrors = Gamer.mirrors.get(message.channelId);
    if (!mirrors?.length) return await reactSuccess(message);

    if (mirrors.length === 1) {
      Gamer.mirrors.delete(message.channelId);
      await db.mirrors.delete(mirrors[0].id);
    } else {
      for (const mirror of mirrors) {
        if (mirror.mirrorChannelID !== args.channel.id.toString()) continue;

        await db.mirrors.delete(mirror.id);
        
      }

      const otherMirrors = mirrors.filter((mirror) => mirror.mirrorChannelID !== args.channel.id.toString());
      
      if (!otherMirrors.length) {
        Gamer.mirrors.delete(message.channelId);
        await db.mirrors.deleteMany({ sourceChannelID: message.channelId.toString() });
      } else {
        Gamer.mirrors.set(message.channelId, otherMirrors);
        await db.mirrors.deleteMany({
          sourceChannelID: message.channelId.toString(),
          mirrorChannelID: args.channel.id.toString(),
        });
      }
    }

    return await reactSuccess(message);
  },
});
