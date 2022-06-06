import { Gamer } from "../../bot.ts";
import { bgBlue, bgYellow, black } from "../../deps.ts";
import { chooseRandom, getTime } from "../helpers/utils.ts";

const funnyAnonymousNames = [
  "Anonymous",
  "God",
  "Discord CEO",
  "Discord API",
  "Developer",
  "Pikachu",
  "Stephen J Lurker",
  "Gordan Freeman",
  "Master Chef",
  "Zelda",
  "Link",
  "The Ghost of Clyde",
  "Wannabe VIP",
  "GamerBot Fan",
  "Wumpus",
];

Gamer.monitors.set("mirrors", {
  name: "mirrors",
  ignoreBots: false,
  execute: async function (message) {
    // Prevent annoying infinite spam using webhooks between 2 channels
    // TODO: vip features
    // if (Gamer.vipGuildIDs.has(message.guildID) && message.webhook_id) {
    if (message.webhookId) return;

    const mirrors = Gamer.mirrors.get(message.channelId);
    if (!mirrors) return;

    const user = Gamer.users.get(message.authorId);
    if (!user) return;

    const botMember = Gamer.users.get(Gamer.id);
    if (!botMember) return;

    console.log(
      `${bgBlue(`[${getTime()}]`)} => [MONITOR: ${bgYellow(black("Mirrors"))}] Executed in ${
        Gamer.guilds.get(message.guildId!)?.name || message.guildId
      } in ${Gamer.channels.get(message.channelId)?.name} (${message.channelId}) by ${user.username}#${
        user.discriminator
      }(${message.authorId}).`
    );

    mirrors.forEach(async (mirror) => {
      // This mirror keeps failing so stop it.
      if (Gamer.failedWebhooks.has(mirror.webhookID)) return;

      let username = mirror.anonymous
        ? `${chooseRandom(funnyAnonymousNames)}#0000`
        : `${user.username}#${user.discriminator}`;
      if (!username.endsWith(" - Gamer Mirror")) username += " - Gamer Mirror";

      // This is a mirror channel so we need to execute a webhook for it

      // Bots cannot send stickers atm so we just set the content to the sticker name
      if (message.stickerItems?.length) {
        message.content += `Sent a Sticker: ${message.stickerItems[0].name}`;
      }

      const [attachment] = message.attachments;
      const blob = attachment
        ? await fetch(attachment.url)
            .then((res) => res.blob())
            .catch(() => undefined)
        : undefined;

      if (mirror.deleteSourceMessages) {
        await Gamer.helpers.deleteMessage(message.channelId, message.id).catch(console.log);
      }

      if (mirror.filterImages && !blob) return;

      if (mirror.filter) {
        const filter = new Function("message", mirror.filter);
        if (!filter(message)) return;
      }

      return Gamer.helpers
        .sendWebhook(Gamer.transformers.snowflake(mirror.webhookID), mirror.webhookToken, {
          content: message.content,
          embeds: message.embeds,
          file: blob ? { name: attachment.filename, blob } : undefined,
          username: username.substring(0, 80) || "Unknown User - Gamer Mirror",
          avatarUrl: Gamer.helpers.avatarURL(
            mirror.anonymous ? Gamer.id : user.id,
            mirror.anonymous ? botMember.discriminator : user.discriminator,
            {
              avatar: mirror.anonymous ? botMember.avatar : user.avatar,
            }
          ),
          allowedMentions: { parse: [] },
        })
        .catch(() => Gamer.failedWebhooks.add(mirror.webhookID));
    });
  },
});
