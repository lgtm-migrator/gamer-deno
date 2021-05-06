import { bot } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("roles", {
  name: "levels",
  aliases: ["lvl"],
  permissionLevels: [PermissionLevels.ADMIN],
  arguments: [{ name: "subcommand", type: "subcommand", required: false }],
  execute: async function (message, _args, guild) {
    const levels = await db.levels.findMany({ guildID: message.guildID }, true);
    if (!levels.length) return bot.helpers.reactError(message);

    const responses = bot.helpers.chunkStrings(
      levels.map(
        (lvl) =>
          `**#${lvl.id.substring(lvl.id.indexOf("-") + 1)}**  ${lvl.roleIDs
            .filter((id) => guild?.roles.has(id))
            .map((id) => `<@&${id}>`)}`
      )
    );
    for (const response of responses) {
      await message.send({ content: response, mentions: { parse: [] } }).catch(console.log);
    }
  },
});
