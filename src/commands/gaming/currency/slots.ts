import { bot, chooseRandom } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { createCommand } from "../../../utils/helpers.ts";
import { translate } from "../../../utils/i18next.ts";

const allEmojis = [
  bot.constants.emojis.snap,
  bot.constants.emojis.slam,
  bot.constants.emojis.dab,
  bot.constants.emojis.success,
  bot.constants.emojis.gamerHeart,
  bot.constants.emojis.gamerHug,
  bot.constants.emojis.gamerOnFire,
  bot.constants.emojis.gamerCry,
  bot.constants.emojis.bite,
  bot.constants.emojis.pat,
  bot.constants.emojis.poke,
  bot.constants.emojis.lmao,
  bot.constants.emojis.tantrum,
  bot.constants.emojis.furious,
  bot.constants.emojis.hurray,
  bot.constants.emojis.starry,
  bot.constants.emojis.heartthrob,
  bot.constants.emojis.huh,
  bot.constants.emojis.toastspinning,
  bot.constants.emojis.twohundretIQ,
  bot.constants.emojis.RemDance,
  bot.constants.emojis.Aquaaah,
  bot.constants.emojis.NezukoDance,
  bot.constants.emojis.dancemonkey,
];

createCommand({
  name: "slots",
  cooldown: {
    seconds: 30,
    allowedUses: 6,
  },
  botChannelPermissions: ["VIEW_CHANNEL", "SEND_MESSAGES", "USE_EXTERNAL_EMOJIS", "READ_MESSAGE_HISTORY"],
  execute: async function (message) {
    const emojis = [];

    // This allows us to add as many emojis we want but the odds remain the same. More unique emojis help spam feel less spam and more users want to join gamer server to get access to those emojis.
    while (emojis.length < 10) {
      emojis.push(chooseRandom(allEmojis));
    }

    const row1 = [];
    const row2 = [];
    const row3 = [];

    for (let i = 0; i < 9; i++) {
      const emoji = chooseRandom(emojis);
      if (row1.length < 3) row1.push(emoji);
      else if (row2.length < 3) row2.push(emoji);
      else row3.push(emoji);
    }

    const winningSet = new Set(row2);
    const topSet = new Set(row1);
    const bottomSet = new Set(row3);

    let response = "strings:SLOTS_LOSER";
    let finalAmount = 1;

    const isSupporter = bot.activeMembersOnSupportServer.has(message.author.id);

    const userSettings = await db.users.get(message.author.id);
    if (!userSettings) return bot.helpers.reactError(message);

    // If they lost all three are unique emojis
    if (winningSet.size === 3) {
      if (userSettings.coins > 0) {
        if (userSettings.coins < 2) userSettings.coins -= 1;
        else {
          userSettings.coins -= 2;
          response = "strings:SLOTS_LOSER_MULTI";
        }
      } else {
        userSettings.coins += 1;
        response = "strings:SLOTS_FREEBIE";
      }
    } // If 2 of them were the same emoji
    else if (winningSet.size === 2) {
      response = "strings:SLOTS_WINNER_PARTIAL";
      finalAmount *= 10;
      userSettings.coins += finalAmount * (isSupporter ? 2 : 1);
    } // If all three emojis are the same. WINNER!
    else {
      // All three rows were winners
      if (bottomSet.size === 1 && topSet.size === 1) {
        const winningEmoji = [...winningSet][0];
        // All 9 emojis are the same
        if (winningEmoji === [...topSet][0] && winningEmoji === [...bottomSet][0]) {
          response = "strings:SLOTS_WINNER_COMPLETE";
          finalAmount *= 5000;
          userSettings.coins += finalAmount * (isSupporter ? 2 : 1);
        } // The rows are different
        else {
          response = "strings:SLOTS_WINNER_LUCKY";
          finalAmount *= 1000;
          userSettings.coins += finalAmount * (isSupporter ? 2 : 1);
        }
      } // 2 rows were all the same emoji
      else if (bottomSet.size === 1 || topSet.size === 1) {
        response = "strings:SLOTS_WINNER_MULTIPLE";
        finalAmount *= 500;
        userSettings.coins += finalAmount * (isSupporter ? 2 : 1);
      } // Only one row was the same
      else {
        response = "strings:SLOTS_WINNER_FULL";
        finalAmount *= 100;
        userSettings.coins += finalAmount * (isSupporter ? 2 : 1);
      }
    }

    await db.users.update(message.author.id, userSettings);

    const details = [
      translate(message.guildID, response, {
        amount: finalAmount,
        emoji: bot.constants.emojis.coin,
      }),
    ];
    if (isSupporter && winningSet.size < 3) {
      details.push(
        translate(message.guildID, "strings:SLOTS_DOUBLE_REWARD", {
          amount: finalAmount * 2,
        })
      );
    }
    details.push(row1.join(" | "), row2.join(" | "), row3.join(" | "));

    return message.reply(details.join("\n"));
  },
});
