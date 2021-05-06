// This task will help remove un-used collectors to help keep our cache optimized.
import { bot } from "../../deps.ts";

bot.tasks.set(`collectors`, {
  name: `collectors`,
  // Runs this function once a minute
  interval: bot.constants.milliseconds.MINUTE,
  execute: async function () {
    const now = Date.now();

    bot.messageCollectors.forEach(async (collector, key) => {
      // This collector has not finished yet.
      if (collector.createdAt + collector.duration > now) return;

      // Remove the collector
      bot.messageCollectors.delete(key);
      // Reject the promise so code can continue in commands.
      return collector.reject(`Failed To Collect A Message ${key}`);
    });

    bot.reactionCollectors.forEach(async (collector, key) => {
      // This collector has not finished yet.
      if (collector.createdAt + collector.duration > now) return;

      // Remove the collector
      bot.reactionCollectors.delete(key);
      // Reject the promise so code can continue in commands.
      return collector.reject(`Failed To Collect A Reaction ${key}`);
    });
  },
});
