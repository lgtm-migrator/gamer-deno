import { bgBlue, bgYellow, black, bot, cache } from "../../deps.ts";
import { getTime } from "../utils/helpers.ts";

bot.monitors.set("analytics", {
  name: "analytics",
  execute: async function (message) {
    // If not a bot mark the user as active
    if (!message.author.bot) {
      bot.memberLastActive.set(message.author.id, message.timestamp);
    }

    if (!bot.vipGuildIDs.has(message.guildID) || !bot.guildIDsAnalyticsEnabled.has(message.guildID)) {
      return;
    }

    console.log(
      `${bgBlue(`[${getTime()}]`)} => [MONITOR: ${bgYellow(black("analytics"))}] Executing in ${
        message.guild?.name || message.guildID
      } in ${message.channelID}.`
    );

    // Sets the total message count on the server
    const current = bot.analyticsMessages.get(message.guildID);
    bot.analyticsMessages.set(message.guildID, (current || 0) + 1);

    // Sets the channel id for determining channel activity
    const currentChannel = bot.analyticsDetails.get(`${message.channelID}-${message.guildID}`);
    bot.analyticsDetails.set(`${message.channelID}-${message.guildID}`, (currentChannel || 0) + 1);

    // Sets the user id for determining user activity
    const currentUser = bot.analyticsDetails.get(`${message.author.id}-${message.guildID}`);
    bot.analyticsDetails.set(`${message.author.id}-${message.guildID}`, (currentUser || 0) + 1);

    const guild = cache.guilds.get(message.guildID);
    if (!guild) return;

    // Check if any of the words in the message was an custom server emoji
    for (const word of message.content.split(" ")) {
      // If not a valid emoji form skip
      if (!word.startsWith("<:") || !word.startsWith("<a:")) continue;
      // A valid custom emoji now we check if its from this server.
      const validEmoji = guild.emojis.find((emoji) => `<${emoji.animated ? "a" : ""}:${emoji.name}:${emoji.id}>`);
      if (validEmoji) {
        // Sets the emoji id for determining emoji activity
        const currentEmoji = bot.analyticsDetails.get(`${validEmoji.id!}-${message.guildID}`);
        bot.analyticsDetails.set(`${validEmoji.id!}-${message.guildID}`, (currentEmoji || 0) + 1);
      }
    }
  },
});
