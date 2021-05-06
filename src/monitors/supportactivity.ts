import { bgBlue, bgYellow, black, bot } from "../../deps.ts";
import { db } from "../database/database.ts";
import { getTime } from "../utils/helpers.ts";

bot.monitors.set("supportactivity", {
  name: "supportactivity",
  execute: async function (message) {
    if (message.guildID !== bot.constants.botSupportServerID) return;
    if (bot.activeMembersOnSupportServer.has(message.author.id)) return;

    console.log(`${bgBlue(`[${getTime()}]`)} => [MONITOR: ${bgYellow(black("supportactivity"))}] Started.`);

    const settings = await db.users.get(message.author.id);
    await db.users.update(message.author.id, {
      coins: (settings?.coins || 0) + 100,
    });

    // sendResponse(
    //   message,
    //   "Thank you for being active on our server today! As a thank you, I have granted you some free coins to play with.",
    // );

    bot.activeMembersOnSupportServer.add(message.author.id);
  },
});
