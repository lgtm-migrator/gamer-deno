import { createCommand } from "../../../utils/helpers.ts";
// import { bot, cache } from "../../../../deps.ts";

createCommand({
  name: "leaderboard",
  aliases: ["lb", "leaderboards"],
  guildOnly: true,
  botChannelPermissions: ["VIEW_CHANNEL", "SEND_MESSAGES", "ATTACH_FILES", "EMBED_LINKS"],
  arguments: [
    { name: "subcommand", type: "subcommand", required: false },
    { name: "member", type: "member", required: false },
  ] as const,
  execute: async function (message, args) {
    // TODO: Remove that after move to mongodb
    return message.reply("This command is currently disabled due to a database problem.");

    //  if (!args.member) args.member = cache.members.get(message.author.id)!;
    //  if (!args.member) return bot.helpers.reactError(message);
    //
    //  const buffer = await bot.helpers.makeLocalCanvas(
    //    message,
    //    args.member,
    //  );
    //  if (!buffer) return bot.helpers.reactError(message);

    //const embed = bot.helpers.authorEmbed(message).attachFile(
    // buffer,
    // "profile.jpg",
    //);
    //return message.send({ embed, file: embed.embedFile });
  },
});
