import { bot } from "../../deps.ts";
import { addReactions, botHasChannelPermissions, cache, deleteMessage, memberIDHasPermission } from "../../deps.ts";
import { db } from "../database/database.ts";

bot.helpers.todoReactionHandler = async function (message, emoji, userID) {
  const settings = await db.guilds.get(message.guildID);
  if (!settings) return;

  const guild = cache.guilds.get(message.guildID);
  if (!guild) return;

  const member = cache.members.get(userID)?.guilds.get(message.guildID);
  if (!member) return;

  if (
    !member.roles.includes(settings.adminRoleID) &&
    !settings.modRoleIDs?.some((id) => member.roles.includes(id)) &&
    !(await memberIDHasPermission(userID, guild.id, ["ADMINISTRATOR"]))
  ) {
    return;
  }

  // If not in a related channel cancel out.
  if (
    ![
      settings.todoArchivedChannelID,
      settings.todoBacklogChannelID,
      settings.todoCompletedChannelID,
      settings.todoCurrentSprintChannelID,
      settings.todoNextSprintChannelID,
    ].includes(message.channelID)
  ) {
    return;
  }

  if (emoji.name === bot.constants.emojis.todo.delete) {
    if (!(await botHasChannelPermissions(message.channelID, ["MANAGE_MESSAGES"]))) {
      return;
    }

    return deleteMessage(message);
  }

  const channelID =
    emoji.name === bot.constants.emojis.todo.archived
      ? settings.todoArchivedChannelID
      : emoji.name === bot.constants.emojis.todo.backlog
      ? settings.todoBacklogChannelID
      : emoji.name === bot.constants.emojis.todo.completed
      ? settings.todoCompletedChannelID
      : emoji.name === bot.constants.emojis.todo.current
      ? settings.todoCurrentSprintChannelID
      : emoji.name === bot.constants.emojis.todo.next
      ? settings.todoNextSprintChannelID
      : undefined;

  if (!channelID || channelID === message.channelID) return;

  const movedMessage = await bot.helpers.moveMessageToOtherChannel(message, channelID);
  if (!movedMessage || !(await botHasChannelPermissions(channelID, ["ADD_REACTIONS", "READ_MESSAGE_HISTORY"]))) {
    return;
  }

  return addReactions(channelID, movedMessage.id, Object.values(bot.constants.emojis.todo), true);
};
