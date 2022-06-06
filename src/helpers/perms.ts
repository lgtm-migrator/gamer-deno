import { Gamer } from "../../bot.ts";
import { Message, hasGuildPermissions } from "../../deps.ts";
import { GuildSchema } from "../database/schemas.ts";

export function isAdmin(message: Message, settings?: GuildSchema) {
  if (!message.guildId) return false;

  const hasAdminPerm = hasGuildPermissions(Gamer, message.guildId, message.authorId, ["ADMINISTRATOR"]);
  if (hasAdminPerm) return true;

  const member = Gamer.members.get(Gamer.transformers.snowflake(`${message.authorId}${message.guildId}`));
  if (!member) return false;

  return settings?.adminRoleID ? member.roles.includes(Gamer.transformers.snowflake(settings.adminRoleID)) : false;
}
