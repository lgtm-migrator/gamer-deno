import { Gamer } from "../../bot.ts";
import {
  hasChannelPermissions,
  hasGuildPermissions,
  botHasChannelPermissions,
  botHasGuildPermissions,
} from "../../deps.ts";

Gamer.events.messageCreate = async function (_, message) {
  // Update stats in cache
  Gamer.stats.messagesProcessed += 1;
  if (message.authorId === Gamer.id) Gamer.stats.messagesSent += 1;
  if (!Gamer.fullyReady) return;

  Gamer.monitors.forEach(async (monitor) => {
    // The !== false is important because when not provided we default to true
    if (monitor.ignoreBots !== false && message.isBot) return;
    if (monitor.ignoreDM !== false && !message.guildId) return;
    if (monitor.ignoreEdits && message.editedTimestamp) return;
    if (monitor.ignoreOthers && message.authorId !== Gamer.id) return;

    // Permission checks

    // No permissions are required
    if (
      !monitor.botChannelPermissions?.length &&
      !monitor.botServerPermissions?.length &&
      !monitor.userChannelPermissions?.length &&
      !monitor.userServerPermissions?.length
    ) {
      return monitor.execute(message);
    }

    // If some permissions is required it must be in a guild
    if (!message.guildId) return;

    // Check if the message author has the necessary channel permissions to run this monitor
    if (
      monitor.userChannelPermissions &&
      !hasChannelPermissions(Gamer, message.channelId, message.authorId, monitor.userChannelPermissions)
    )
      return;

    // Check if the message author has the necessary permissions to run this monitor
    if (
      monitor.userServerPermissions &&
      Gamer.members.get(Gamer.transformers.snowflake(`${message.authorId}${message.guildId}`)) &&
      !hasGuildPermissions(Gamer, message.guildId, message.authorId, monitor.userServerPermissions)
    )
      return;

    // Check if the bot has the necessary channel permissions to run this monitor in this channel
    if (
      monitor.botChannelPermissions &&
      !botHasChannelPermissions(Gamer, message.channelId, monitor.botChannelPermissions)
    )
      return;

    // Check if the bot has the necessary permissions to run this monitor
    if (monitor.botServerPermissions && !botHasGuildPermissions(Gamer, message.guildId, monitor.botServerPermissions))
      return;

    await monitor.execute(message).catch(console.log);
  });
};
