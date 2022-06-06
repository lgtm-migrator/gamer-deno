import { Gamer } from "../../bot.ts";
import { Message, sendMessage, CreateMessage, Interaction, InteractionTypes } from "../../deps.ts";

/** This function should be used when you want to send a response that will send a reply message. */
export async function sendResponse(message: Message, content: string | CreateMessage) {
  const contentWithMention =
    typeof content === "string"
      ? { content, mentions: { repliedUser: true }, replyMessageID: message.id }
      : {
          ...content,
          allowedMentions: { ...(content.allowedMentions || {}), repliedUser: true },
          replyMessageID: message.id,
        };

  return await Gamer.helpers.sendMessage(message.channelId, contentWithMention).catch(console.log);
}

function snowflakeToTimestamp(id) {
  return Math.floor(Number(id) / 4194304) + 1420070400000;
}

/** This function should convert an interaction into a false message like object. */
export async function executeMessageCommandFromInteraction(interaction: Interaction) {
  let content = "";
  const args: Record<string, unknown> = {};
  const command = interaction.data ? Gamer.commands.get(interaction.data.name) : undefined;
  if (!command) {
    console.log(`Interaction Found No Valid Command. Name: ${interaction.data?.name}`);
    return console.log(interaction);
  }

  if (interaction.data && interaction.type === InteractionTypes.ApplicationCommand) {
    content = `/${interaction.data.name}`;

    // Subcommand group
    for (const option of interaction.data.options ?? []) {
      if (option.value) {
        content += ` ${option.value}`;
        args[option.name] = option.value;
      }

      // Subcommand
      for (const suboption of option.options ?? []) {
        if (suboption.value) {
          content += ` ${suboption.value}`;
          args[suboption.name] = suboption.value;
        }

        // Options
        for (const opt of suboption.options ?? []) {
          if (opt.value) {
            content += ` ${opt.value}`;
            args[opt.name] = opt.value;
          }
        }
      }
    }
  }

  const message = {
    isBot: interaction.user.toggles.bot,
    tag: `${interaction.user.username}#${interaction.user.discriminator}`,
    timestamp: snowflakeToTimestamp(interaction.id),
    bitfield: 0n,
    attachments: [],
    embeds: [],
    reactions: [],
    components: [],
    mentionedUserIds: [],
    mentionedRoleIds: [],
    mentionedChannelIds: [],
    type: 0,
    id: interaction.id,
    guildId: interaction.guildId,
    channelId: interaction.channelId ?? 0n,
    authorId: interaction.user.id,
    member: interaction.member,
    content,

    // TODO: Add necessary interaction information
    interactionData: {
      token: interaction.token,
      args,
    },
  };

  const guild = Gamer.guilds.get(interaction.guildId!);

  // Check subcommand permissions and options
  if (!(await commandAllowed(message, command, guild))) return;

  // @ts-ignore
  await command.execute?.(message, args, guild);
  //   await Gamer.helpers.completeMission(message.guildId, message.authorId, command.name);
  return logCommand(message, guild?.name || "DM", "Success", command.name);
}
