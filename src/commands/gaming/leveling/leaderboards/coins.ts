import { bot, cache } from "../../../../../deps.ts";
import { createSubcommand } from "../../../../utils/helpers.ts";

createSubcommand("leaderboard", {
  name: "coins",
  aliases: ["c"],
  guildOnly: true,
  botChannelPermissions: ["VIEW_CHANNEL", "SEND_MESSAGES", "ATTACH_FILES", "EMBED_LINKS"],
  arguments: [{ name: "member", type: "member", required: false }] as const,
  execute: async function (message, args) {
    if (!args.member) args.member = cache.members.get(message.author.id)!;
    if (!args.member) return bot.helpers.reactError(message);

    const buffer = await bot.helpers.makeCoinsCanvas(message, args.member);
    if (!buffer) return bot.helpers.reactError(message);

    const embed = bot.helpers.authorEmbed(message).attachFile(buffer, "profile.jpg");
    return message.send({ embed, file: embed.embedFile });
  },
});
