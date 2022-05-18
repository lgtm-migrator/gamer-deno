import { Gamer } from "../../bot.ts";

Gamer.events.ready = function (bot, payload) {
  console.log(`[Shard Ready] Shard ${payload.shardId} is ready`);

  // max shards - 1 because shard 0 exists
  // This is the final shard so we can now do setup stuff here
  if (payload.shardId === Gamer.gateway.maxShards - 1) {
    console.info(`Loaded ${Gamer.arguments.size} Argument(s)`);
    console.info(`Loaded ${Gamer.commands.size} Command(s)`);
    console.info(
      `Loaded ${Object.entries(Gamer.events).filter(([key, value]) => value.name !== "ignore").length} Event(s)`
    );
    console.info(`Loaded ${Gamer.inhibitors.size} Inhibitor(s)`);
    console.info(`Loaded ${Gamer.monitors.size} Monitor(s)`);
    console.info(`Loaded ${Gamer.tasks.size} Task(s)`);
  }
};
