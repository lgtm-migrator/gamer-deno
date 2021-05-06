import { bgBlue, bgYellow, black, bot, cache } from "../../deps.ts";
import { db } from "../database/database.ts";
import { getTime } from "../utils/helpers.ts";
import { sweepInactiveGuildsCache } from "./dispatchRequirements.ts";

bot.eventHandlers.ready = async function () {
  console.info(`Loaded ${bot.arguments.size} Argument(s)`);
  console.info(`Loaded ${bot.commands.size} Command(s)`);
  console.info(`Loaded ${Object.keys(bot.eventHandlers).length} Event(s)`);
  console.info(`Loaded ${bot.inhibitors.size} Inhibitor(s)`);
  console.info(`Loaded ${bot.monitors.size} Monitor(s)`);
  console.info(`Loaded ${bot.tasks.size} Task(s)`);

  // Special Task
  // After interval of the bot starting up, remove inactive guilds
  setInterval(() => {
    sweepInactiveGuildsCache();
  }, bot.constants.milliseconds.HOUR);

  bot.tasks.forEach(async (task) => {
    // THESE TASKS MUST RUN WHEN STARTING BOT
    if (["missions", "vipmembers"].includes(task.name)) await task.execute();

    setTimeout(async () => {
      console.log(`${bgBlue(`[${getTime()}]`)} => [TASK: ${bgYellow(black(task.name))}] Started.`);
      try {
        await task.execute();
      } catch (error) {
        console.log(error);
      }

      setInterval(async () => {
        if (!bot.fullyReady) return;
        console.log(`${bgBlue(`[${getTime()}]`)} => [TASK: ${bgYellow(black(task.name))}] Started.`);
        try {
          await task.execute();
        } catch (error) {
          console.log(error);
        }
      }, task.interval);
    }, Date.now() % task.interval);
  });

  bot.fullyReady = true;

  console.log(`[READY] Bot is online and ready in ${cache.guilds.size} guild(s)!`);
};
