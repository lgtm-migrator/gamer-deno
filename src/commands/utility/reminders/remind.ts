import { bot } from "../../../../deps.ts";
import { createCommand } from "../../../utils/helpers.ts";

createCommand({
  name: `remind`,
  aliases: ["reminders", "remindme"],
  guildOnly: true,
  description: "strings:REMIND_DESCRIPTION",
  arguments: [{ name: "subcommand", type: "subcommand" }],
  execute: async (message, _args, guild) => {
    bot.commands.get("remind")?.subcommands?.get("list")?.execute?.(message, {}, guild);
  },
});
