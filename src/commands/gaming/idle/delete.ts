import { bot } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

// TODO: confirm?
createSubcommand("idle", {
  name: "delete",
  execute: async function (message) {
    await db.idle.delete(message.author.id);
    return bot.helpers.reactSuccess(message);
  },
});
