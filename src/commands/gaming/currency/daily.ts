import { bot } from "../../../../deps.ts";
import { createCommand } from "../../../utils/helpers.ts";

// TODO: add functionality
createCommand({
  name: "daily",
  execute: async function (message) {
    return bot.helpers.reactError(message);
  },
});
