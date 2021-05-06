import { bot, ReactionPayload, removeReactionEmoji } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("roles-reactions", {
  name: "remove",
  aliases: ["r"],
  permissionLevels: [PermissionLevels.ADMIN],
  guildOnly: true,
  arguments: [
    { name: "name", type: "string", lowercase: true },
    { name: "emoji", type: "emoji" },
  ] as const,
  execute: async function (message, args) {
    const reactionRole = await db.reactionroles.findOne({
      guildID: message.guildID,
      name: args.name,
    });
    if (!reactionRole) return bot.helpers.reactError(message);

    await db.reactionroles.update(reactionRole.id, {
      reactions: reactionRole.reactions.filter((r) => r.reaction === args.emoji),
    });

    const emoji = typeof args.emoji === "string" ? args.emoji : bot.helpers.emojiUnicode(args.emoji as ReactionPayload);

    await removeReactionEmoji(reactionRole.channelID, reactionRole.messageID, emoji).catch(console.log);
    return bot.helpers.reactSuccess(message);
  },
});
