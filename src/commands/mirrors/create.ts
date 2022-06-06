import { Gamer } from "../../../bot.ts";
import { botHasChannelPermissions, getWebhook, createWebhook } from "../../../deps.ts";
import { db } from "../../database/database.ts";
import { createSubcommand } from "../../helpers/commands.ts";
import { isAdmin } from "../../helpers/perms.ts";
import { reactSuccess } from "../../helpers/reactions.ts";

createSubcommand("mirrors", {
  name: "create",
  arguments: [
    // Other guild option
    { name: "guild", type: "guild", required: false },
    // The same guild channel
    { name: "channel", type: "guildtextchannel", required: false },
    // This is when u need to provide a channel id from another guild
    { name: "channelID", type: "string", required: false },
  ] as const,
  execute: async (message, args) => {
    // TODO: (vip) Using multiple guilds require vip features
    // if (args.guild && !Gamer.vipGuildIDs.has(message.guildID)) {
    //   return message.reply(translate(message.guildID, "strings:NEED_VIP"));
    // }

    const botUser = Gamer.users.get(Gamer.id);
    if (!botUser) return;

    let mirrorChannel = args.channel;

    // This is a vip guild
    if (args.guild) {
      // A guild was provided but a channel id was not
      if (!args.channelID) {
        return await Gamer.helpers.sendTextMessage(
          message.channelId,
          "A guild was provided but a channel was not provided."
        );
      }

      // Reassign the guild channel
      mirrorChannel = Gamer.channels.get(Gamer.transformers.snowflake(args.channelID));
      if (!mirrorChannel) {
        return await Gamer.helpers.sendTextMessage(
          message.channelId,
          "The channel you provided was not found. Please try another channel."
        );
      }

      if (!botHasChannelPermissions(Gamer, mirrorChannel, ["MANAGE_WEBHOOKS", "VIEW_CHANNEL", "SEND_MESSAGES"])) {
        return Gamer.helpers.sendTextMessage(
          message.channelId,
          "The channel you provided is missing permissions. **MANAGE_WEBHOOKS, VIEW_CHANNEL, or SEND_MESSAGES**"
        );
      }

      // Extra layer of security to prevent abuse
      const targetGuildSettings = await db.guilds.get(args.guild.id.toString());

      if (!isAdmin(message, targetGuildSettings)) {
        return Gamer.helpers.sendTextMessage(
          message.channelId,
          "You do not have admin permissions in the target guild you provided."
        );
      }
    }

    if (!mirrorChannel) {
      return Gamer.helpers.sendTextMessage(message.channelId, "I was not able to find a mirror channel.");
    }

    // Is the user an admin on this server?
    const guildSettings = await db.guilds.get(message.guildId!.toString());
    if (!isAdmin(message, guildSettings)) {
      return Gamer.helpers.sendTextMessage(message.channelId, "You do not have admin permissions in the server.");
    }

    const webhookExists = await db.mirrors.get(mirrorChannel.id.toString());
    const validWebhook = webhookExists
      ? await Gamer.helpers.getWebhook(Gamer.transformers.snowflake(webhookExists.webhookID))
      : undefined;

    // All requirements passed time to create a webhook.
    const webhook = !validWebhook
      ? await Gamer.helpers.createWebhook(mirrorChannel.id, {
          name: "Gamer Mirror",
          avatar: Gamer.helpers.avatarURL(botUser.id, botUser.discriminator, { avatar: botUser.avatar }),
        })
      : undefined;

    await db.mirrors.create(message.id.toString(), {
      id: message.id.toString(),
      sourceChannelID: message.channelId.toString(),
      mirrorChannelID: mirrorChannel.id.toString(),
      sourceGuildID: message.guildId!.toString(),
      mirrorGuildID: mirrorChannel.guildId.toString(),
      webhookToken: webhookExists?.webhookToken || webhook!.token!,
      webhookID: webhookExists?.webhookID || webhook!.id.toString(),
      filterImages: false,
      deleteSourceMessages: false,
      anonymous: false,
    });

    const cachedSettings = Gamer.mirrors.get(message.channelId) ?? [];
    cachedSettings.push({
      id: message.id.toString(),
      sourceChannelID: message.channelId.toString(),
      mirrorChannelID: mirrorChannel.id.toString(),
      sourceGuildID: message.guildId!.toString(),
      mirrorGuildID: mirrorChannel.guildId.toString(),
      webhookToken: webhookExists?.webhookToken || webhook!.token!,
      webhookID: webhookExists?.webhookID || webhook!.id.toString(),
      filterImages: false,
      deleteSourceMessages: false,
      anonymous: false,
    });

    // Add in cache
    Gamer.mirrors.set(message.channelId, cachedSettings);

    return await reactSuccess(message);
  },
});

