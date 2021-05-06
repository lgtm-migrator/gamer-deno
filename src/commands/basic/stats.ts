import { bot, cache } from "../../../deps.ts";
import { createCommand, humanizeMilliseconds } from "../../utils/helpers.ts";
import { translate } from "../../utils/i18next.ts";
import { Embed } from "./../../utils/Embed.ts";

const UPTIME = Date.now();

createCommand({
  name: "stats",
  botChannelPermissions: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
  guildOnly: true,
  execute: async function (message, _args) {
    let totalMemberCount = 0;

    for (const guild of cache.guilds.values()) {
      totalMemberCount += guild.memberCount;
    }

    const commands = bot.commands.reduce((subtotal, command) => subtotal + 1 + (command.subcommands?.size || 0), 0);

    const embed = new Embed()
      .setTitle(translate(message.guildID, "strings:BOT_STATS"))
      .setColor("random")
      .addField(
        translate(message.guildID, "strings:SERVERS"),
        (cache.guilds.size + bot.dispatchedGuildIDs.size).toLocaleString("en-US"),
        true
      )
      .addField(translate(message.guildID, "strings:MEMBERS"), totalMemberCount.toLocaleString("en-US"), true)
      .addField(
        translate(message.guildID, "strings:CHANNELS"),
        (cache.channels.size + bot.dispatchedChannelIDs.size).toLocaleString("en-US"),
        true
      )
      .addField(translate(message.guildID, "strings:UPTIME"), humanizeMilliseconds(Date.now() - UPTIME), true)
      .addField(translate(message.guildID, "strings:COMMANDS"), commands.toLocaleString("en-US"), true)
      .setTimestamp();

    return message.send({ embed });
  },
});
