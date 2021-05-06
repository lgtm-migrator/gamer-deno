import { bot } from "../../deps.ts";

bot.eventHandlers.shardReady = function (shardID) {
  console.log(`[Shard Ready] Shard ${shardID} is ready`);
};
