import { Gamer } from "../../bot.ts";
import { getChannel, fetchMembers } from "../../deps.ts";
import { MILLISECONDS } from "../constants/time.ts";
import { db } from "../database/database.ts";

Gamer.tasks.set("database", {
  name: "database",
  interval: MILLISECONDS.WEEK,
  execute: async function () {
    const now = Date.now();
    // FOR EVERY TABLE, WE RUN ONCE A WEEK AND CLEAN UP ANYTHING NO LONGER USED

    // MIRRORS
    const mirrors = await db.mirrors.getAll();
    mirrors.forEach(async (m) => {
      // If the webhook is failing, we no longer need this in the db.
      if (Gamer.failedWebhooks.has(m.webhookID)) return await db.mirrors.delete(m.id);

      // Dispatched channels are still existing channels.
      if (
        // If source channel is dispatched or its cached it
        (Gamer.dispatchedChannelIds.has(Gamer.transformers.snowflake(m.sourceChannelID)) ||
          Gamer.channels.has(Gamer.transformers.snowflake(m.sourceChannelID))) &&
        // AND if mirror channel is dispatch or its cached we cancel
        (Gamer.dispatchedChannelIds.has(Gamer.transformers.snowflake(m.mirrorChannelID)) ||
          Gamer.channels.has(Gamer.transformers.snowflake(m.mirrorChannelID)))
      )
        return;

      // Either the mirror channel or the source channel no longer exist.
      return await db.mirrors.delete(m.id);
    });
  },
});
