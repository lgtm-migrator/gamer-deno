import { bot } from "../../cache.ts";
import { cache } from "../../deps.ts";

bot.arguments.set("emoji", {
  name: "emoji",
  execute: async function (_argument, parameters, message) {
    let [id] = parameters;
    if (!id) return;

    if (bot.constants.emojis.defaults.has(id)) return id;

    if (id.startsWith("<:") || id.startsWith("<a:")) {
      id = id.substring(id.lastIndexOf(":") + 1, id.length - 1);
    }

    let emoji = cache.guilds.get(message.guildID)?.emojis.find((e) => e.id === id);
    if (!emoji) {
      for (const guild of cache.guilds.values()) {
        const globalemoji = guild.emojis.find((e) => e.id === id);
        if (!globalemoji) continue;

        emoji = globalemoji;
        break;
      }

      if (!emoji) return;
    }

    // @ts-ignore
    return bot.helpers.emojiUnicode(emoji);
  },
});
