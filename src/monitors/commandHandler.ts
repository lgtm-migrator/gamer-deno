import { Gamer } from "../../bot.ts";
import { configs } from "../../configs.ts";
import {
  bgBlack,
  bgBlue,
  bgGreen,
  bgMagenta,
  bgYellow,
  black,
  delay,
  deleteMessage,
  deleteMessages,
  green,
  Guild,
  Message,
  red,
  white,
} from "../../deps.ts";
import { Command } from "../helpers/commands.ts";
import { sendResponse } from "../helpers/messages.ts";
import { translate } from "../helpers/translate.ts";
import { getTime } from "../helpers/utils.ts";

async function invalidCommand(message: Message, commandName: string, parameters: string[], prefix: string) {
  if (!message.guildId) return;
  // TODO: Suport VIP Features
  //   if (!Gamer.vipGuildIDs.has(message.guildId)) return;

  // TODO: Support shortcuts
  //   const shortcut = await db.shortcuts.get(`${message.guildId}-${commandName}`);
  //   if (!shortcut) return;

  // Valid shortcut was found now we need to process it
  //   for (const action of shortcut.actions) {
  //     const command = Gamer.commands.get(action.commandName);
  //     if (!command) continue;

  //     let content = `${prefix}${action.commandName} ${action.args}`;

  //     // Replace all variables args in the shortcut
  //     for (const [index, arg] of parameters.entries()) {
  //       content = content.replace(`{{${index + 1}}}`, arg);
  //     }

  //     message.content = content;

  //     // Execute the command
  //     await Gamer.eventHandlers.messageCreate?.(message);

  //     // Make the bot wait 2 seconds before running next command so it doesnt get inhibited by the slowmode
  //     await delay(2000);
  //   }

  //   if (shortcut.deleteTrigger) await deleteMessage(message).catch(console.log);
}

export const parsePrefix = (guildID: bigint | undefined) => {
  const prefix = guildID ? Gamer.guildPrefixes.get(guildID) : configs.prefix;
  return prefix || configs.prefix;
};

export const parseCommand = (commandName: string) => {
  const command = Gamer.commands.get(commandName);
  if (command) return command;

  // Check aliases if the command wasn't found
  return Gamer.commands.find((cmd) => Boolean(cmd.aliases?.includes(commandName)));
};

export const logCommand = (
  message: Message,
  guildName: string,
  type: "Failure" | "Success" | "Trigger" | "Slowmode" | "Missing" | "Inhibit",
  commandName: string
) => {
  if (type === "Trigger") {
    Gamer.stats.commandsRan += 1;
  }
  const command = `[COMMAND: ${bgYellow(black(commandName || "Unknown"))} - ${bgBlack(
    ["Failure", "Slowmode", "Missing"].includes(type) ? red(type) : type === "Success" ? green(type) : white(type)
  )}]`;

  const user = bgGreen(black(`${message.tag}(${message.authorId})`));
  const guild = bgMagenta(black(`${guildName}${message.guildId ? `(${message.guildId})` : ""}`));

  console.log(`${bgBlue(`[${getTime()}]`)} => ${command} by ${user} in ${guild} with MessageID: ${message.id}`);
};

/** Parses all the arguments for the command based on the message sent by the user. */
async function parseArguments(message: Message, command: Command<any>, parameters: string[]) {
  const args: { [key: string]: unknown } = {};
  if (!command.arguments) return args;

  let missingRequiredArg = false;

  // Clone the parameters so we can modify it without editing original array
  const params = [...parameters];

  // Loop over each argument and validate
  for (const argument of command.arguments) {
    const resolver = Gamer.arguments.get(argument.type || "string");
    if (!resolver) continue;

    const result = await resolver.execute(argument, params, message, command);
    if (result !== undefined) {
      // Assign the valid argument
      args[argument.name] = result;
      // This will use up all args so immediately exist the loop.
      if (
        argument.type &&
        ["subcommands", "...string", "...roles", "...emojis", "...snowflakes"].includes(argument.type)
      ) {
        break;
      }
      // Remove a param for the next argument
      params.shift();
      continue;
    }

    // Invalid arg provided.
    if (Object.prototype.hasOwnProperty.call(argument, "defaultValue")) {
      args[argument.name] = argument.defaultValue;
    } else if (argument.required !== false) {
      // A REQUIRED ARG WAS MISSING TRY TO COLLECT IT
      const question = await sendResponse(
        message,
        translate(message.guildId!, "strings:MISSING_REQUIRED_ARG", {
          name: argument.name,
          type:
            argument.type === "subcommand"
              ? command.subcommands?.map((sub) => sub.name).join(", ") || "subcommand"
              : argument.type,
        })
      ).catch(console.log);
      if (question) {
        // TODO: arg prompts
        // const response = await Gamer.helpers.needMessage(message.authorId, message.channelId).catch(console.log);
        // if (response) {
        //   const responseArg = await resolver.execute(argument, [response.content], message, command);
        //   if (responseArg) {
        //     args[argument.name] = responseArg;
        //     params.shift();
        //     await Gamer.helpers.deleteMessages(message.channelId, [question.id, response.id]).catch(console.log);
        //     continue;
        //   }
        // }
      }

      // console.log("Required Arg Missing: ", message.content, command, argument);
      missingRequiredArg = true;
      argument.missing?.(message);
      break;
    }
  }

  // If an arg was missing then return false so we can error out as an object {} will always be truthy
  return missingRequiredArg ? false : args;
}

/** Runs the inhibitors to see if a command is allowed to run. */
export async function commandAllowed(message: Message, command: Command<any>, guild?: Guild) {
  const inhibitorResults = await Promise.all(
    [...Gamer.inhibitors.values()].map((inhibitor) => inhibitor.execute(message, command, guild))
  );

  if (inhibitorResults.includes(true)) {
    logCommand(message, guild?.name || "DM", "Inhibit", command.name);
    return false;
  }

  return true;
}

async function executeCommand(message: Message, command: Command<any>, parameters: string[], guild?: Guild) {
  try {
    // TODO: slowmode
    // Gamer.slowmode.set(message.authorId, message.timestamp);

    // Parsed args and validated
    const args = await parseArguments(message, command, parameters);
    // Some arg that was required was missing and handled already
    if (!args) {
      // TODO: error handling
      //   await Gamer.helpers.reactError(message);
      return logCommand(message, guild?.name || "DM", "Missing", command.name);
    }

    // If no subcommand execute the command
    const [argument] = command.arguments || [];
    const subcommand = argument ? (args[argument.name] as Command<any>) : undefined;

    if (!argument || argument.type !== "subcommand" || !subcommand) {
      // Check subcommand permissions and options
      if (!(await commandAllowed(message, command, guild))) return;

      // @ts-ignore
      await command.execute?.(message, args, guild);
      // TODO: missions
      //   await Gamer.helpers.completeMission(message.guildId, message.authorId, command.name);
      return logCommand(message, guild?.name || "DM", "Success", command.name);
    }

    // A subcommand was asked for in this command
    if (![subcommand.name, ...(subcommand.aliases || [])].includes(parameters[0])) {
      executeCommand(message, subcommand, parameters, guild);
    } else {
      const subParameters = parameters.slice(1);
      executeCommand(message, subcommand, subParameters, guild);
    }
  } catch (error) {
    console.log(error);
    logCommand(message, guild?.name || "DM", "Failure", command.name);
    // TODO: error handling
    // await Gamer.helpers.reactError(message).catch(console.log);
    // handleError(message, error);
  }
}

// The monitor itself for this file. Above is helper functions for this monitor.
Gamer.monitors.set("commandHandler", {
  name: "commandHandler",
  ignoreDM: false,
  /** The main code that will be run when this monitor is triggered. */
  execute: async function (message: Message) {
    // If the message was sent by a bot we can just ignore it
    if (message.isBot) return;

    let prefix = parsePrefix(message.guildId);
    // FORCE DEFAULT TO A MENTION
    const botMention = [`<@${Gamer.id}>`].find((mention) => message.content === mention) ?? `<@!${Gamer.id}>`;

    console.log(message.content, botMention);
    // If the message is not using the valid prefix or bot mention cancel the command
    if (message.content === botMention) {
      return sendResponse(message, parsePrefix(message.guildId));
    } else if (message.content.startsWith(botMention)) prefix = botMention;
    else if (!message.content.startsWith(prefix)) return;

    console.log("ch", 3);
    // Get the first word of the message without the prefix so it is just command name. `!ping testing` becomes `ping`
    const [commandName, ...parameters] = message.content.substring(prefix.length).split(" ");

    // Check if this is a valid command
    const command = parseCommand(commandName);
    if (!command) {
      return invalidCommand(message, commandName, parameters, prefix);
    }

    const guild = Gamer.guilds.get(message.guildId!);
    logCommand(message, guild?.name || "DM", "Trigger", commandName);

    // TODO: slowmode
    // const lastUsed = Gamer.slowmode.get(message.authorId);
    // // Check if this user is spamming by checking slowmode
    // if (lastUsed && message.timestamp - lastUsed < 2000) {
    //   if (message.guildId)
    //     await deleteMessage(message, translate(message.guildId, "strings:CLEAR_SPAM")).catch(console.log);

    //   return logCommand(message, guild?.name || "DM", "Slowmode", commandName);
    // }

    // TODO: blacklisting
    // // Check if this user is blacklisted. Check if this guild is blacklisted
    // if (Gamer.blacklistedIDs.has(message.authorId) || Gamer.blacklistedIDs.has(message.guildId)) {
    //   return;
    // }

    executeCommand(message, command, parameters, guild);
  },
});
