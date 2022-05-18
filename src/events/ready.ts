import { Gamer } from "../../mod.ts";

Gamer.events.ready = function (bot, payload) {
  console.log(`[Shard Ready] Shard ${payload.shardId} is ready`);

  // FINAL SHARD HAS LOADED
  console.log(payload.shardId === Gamer.gateway.maxShards, payload.shardId, Gamer.gateway.maxShards);
  if (payload.shardId === Gamer.gateway.maxShards) {
  }
};
