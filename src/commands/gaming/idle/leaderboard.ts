import { bot, cache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { createSubcommand } from "../../../utils/helpers.ts";
import { translate } from "../../../utils/i18next.ts";

createSubcommand("idle", {
  name: "leaderboard",
  aliases: ["leaderboards", "lb"],
  cooldown: {
    seconds: 120,
  },
  execute: async function (message) {
    const users = await db.idle.get(message.author.id);
    if (!users) return bot.helpers.reactError(message);

    bot.constants.idle.engine.calculateTotalProfit;

    const profiles = await db.idle.findMany({}, true);
    const leaders = profiles
      .sort((a, b) => {
        const first = bot.constants.idle.engine.calculateTotalProfit(a);
        const second = bot.constants.idle.engine.calculateTotalProfit(b);
        if (first === second) return 0;
        if (second > first) return 1;
        return -1;
      })
      .slice(0, 10);

    const texts = [
      `**${BigInt(users.currency).toLocaleString("en-US")}** 💵 \`${bot.helpers.shortNumber(
        bot.constants.idle.engine.calculateTotalProfit(users)
      )}/s\` 💵`,
      "",
    ];

    for (const [index, profile] of leaders.entries()) {
      const profit = bot.constants.idle.engine.calculateTotalProfit(profile);

      texts.push(
        `${index + 1}. ${(cache.members.get(profile.id)?.tag || profile.id).padEnd(
          20,
          " "
        )} **${bot.helpers.shortNumber(profile.currency)}**💵  \`${bot.helpers.shortNumber(profit)}/s\` 💵`
      );
    }

    const embed = bot.helpers
      .authorEmbed(message)
      .setTitle(message.author.username)
      .setDescription(texts.join("\n"))
      .setFooter(translate(message.guildID, "strings:IDLE_CACHE"));

    return message.send({ embed });
  },
});
