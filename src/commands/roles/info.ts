import { bot } from "../../../deps.ts";
import { Embed } from "../../utils/Embed.ts";
import { createSubcommand } from "../../utils/helpers.ts";
import { translate } from "../../utils/i18next.ts";

createSubcommand("roles", {
  name: "info",
  botChannelPermissions: ["EMBED_LINKS", "SEND_MESSAGES"],
  arguments: [{ name: "role", type: "role" }] as const,
  execute: async function (message, args) {
    const color = `#${args.role.color.toString(16).toUpperCase()}`;
    const embed = new Embed()
      .setColor(color)
      .addField(translate(message.guildID, "strings:ROLE_NAME"), args.role.name, true)
      .addField(translate(message.guildID, "strings:ROLE_ID"), args.role.id, true)
      .addField(translate(message.guildID, "strings:ROLE_COLOR"), color, true)
      .addField(
        translate(message.guildID, "strings:SHOW_SEPARATELY"),
        args.role.hoist ? bot.constants.emojis.success : bot.constants.emojis.failure,
        true
      )
      .addField(
        translate(message.guildID, "strings:MENTIONABLE"),
        args.role.mentionable ? bot.constants.emojis.success : bot.constants.emojis.failure,
        true
      )
      .addField(translate(message.guildID, "strings:POSITION"), args.role.position.toString(), true)
      .setFooter(translate(message.guildID, "strings:CREATED_AT"))
      .setTimestamp(bot.helpers.snowflakeToTimestamp(args.role.id));

    return message.send({ embed });
  },
});
