import { bot } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("giveaway", {
  name: "delete",
  permissionLevels: [PermissionLevels.ADMIN, PermissionLevels.MODERATOR],
  aliases: ["d"],
  arguments: [{ name: "giveawayID", type: "snowflake" }] as const,
  execute: async function (message, args) {
    await db.giveaways.delete(args.giveawayID);
    bot.giveawayMessageIDs.delete(args.giveawayID);
    return bot.helpers.reactSuccess(message);
  },
});
