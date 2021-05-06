// This task will update the database once a minute with all the latest product analytics
import { bot } from "../../cache.ts";
import { botID } from "../../deps.ts";
import { db } from "../database/database.ts";

bot.tasks.set(`botstats`, {
  name: `botstats`,
  // Runs this function once a minute
  interval: bot.constants.milliseconds.MINUTE * 5,
  execute: async function () {
    const stats = await db.client.get(botID);
    if (!stats) {
      await db.client.create(botID, {
        id: botID,
        botID,
        messagesProcessed: "0",
        messagesDeleted: "0",
        messagesEdited: "0",
        messagesSent: "0",
        reactionsAddedProcessed: "0",
        reactionsRemovedProcessed: "0",
        commandsRan: "0",
        feedbacksSent: "0",
        automod: "0",
      });
      return console.log("Botstats task was unable to run because no stats was found in DB.");
    }

    // Clone the current stats
    const currentBotStats = { ...bot.stats };

    // Reset current stats
    bot.stats.messagesDeleted = 0;
    bot.stats.messagesEdited = 0;
    bot.stats.messagesProcessed = 0;
    bot.stats.messagesSent = 0;
    bot.stats.reactionsAddedProcessed = 0;
    bot.stats.reactionsRemovedProcessed = 0;
    bot.stats.commandsRan = 0;
    bot.stats.feedbacksSent = 0;
    bot.stats.automod = 0;

    // Update the stats in the database.
    await db.client.update(botID, {
      ...stats,
      messagesDeleted: String(BigInt(stats.messagesDeleted || "0") + BigInt(currentBotStats.messagesDeleted)),
      messagesEdited: String(BigInt(stats.messagesEdited || "0") + BigInt(currentBotStats.messagesEdited)),
      messagesProcessed: String(BigInt(stats.messagesProcessed || "0") + BigInt(currentBotStats.messagesProcessed)),
      messagesSent: String(BigInt(stats.messagesSent || "0") + BigInt(currentBotStats.messagesSent)),
      reactionsAddedProcessed: String(
        BigInt(stats.reactionsAddedProcessed || "0") + BigInt(currentBotStats.reactionsAddedProcessed)
      ),
      reactionsRemovedProcessed: String(
        BigInt(stats.reactionsRemovedProcessed || "0") + BigInt(currentBotStats.reactionsRemovedProcessed)
      ),
      commandsRan: String(BigInt(stats.commandsRan || "0") + BigInt(currentBotStats.commandsRan)),
      feedbacksSent: String(BigInt(stats.feedbacksSent || "0") + BigInt(currentBotStats.feedbacksSent)),
      automod: String(BigInt(stats.automod || "0") + BigInt(currentBotStats.automod)),
    });
  },
});
