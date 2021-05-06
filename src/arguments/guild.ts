import { bot } from "../../cache.ts";
import { cache } from "../../deps.ts";

bot.arguments.set("guild", {
  name: "guild",
  execute: async function (_argument, parameters, message) {
    const [id] = parameters;
    if (!id) return;

    return cache.guilds.get(id);
  },
});
