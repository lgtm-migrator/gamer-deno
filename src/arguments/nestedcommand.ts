import { bot } from "../../deps.ts";
import { Command } from "../utils/helpers.ts";

bot.arguments.set("nestedcommand", {
  name: "nestedcommand",
  execute: async function (_argument, parameters) {
    let command = bot.commands.get(parameters.join("\n").toLowerCase());
    if (command) return command;

    for (const word of parameters) {
      const isCommand: Command<any> | undefined = command
        ? // IF A COMMAND WAS FOUND WE SEARCH FOR ITS SUBCOMMANDS
          command.subcommands?.get(word)
        : // ELSE FIND THE VALID COMMAND OR COMMAND BY ITS ALIAS
          bot.commands.get(word) || bot.commands.find((cmd) => Boolean(cmd.aliases?.includes(word)));
      if (!isCommand) continue;

      command = isCommand;
    }

    return command;
  },
});
