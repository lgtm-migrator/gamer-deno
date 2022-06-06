import { configs } from "./configs.ts";
import {
  createBot,
  enableCachePlugin,
  enableHelpersPlugin,
  enableCacheSweepers,
  enablePermissionsPlugin,
  Bot,
  Collection,
  bgBlue,
  bgYellow,
  black,
  PermissionStrings,
  Message,
  Guild,
  Intents,
} from "./deps.ts";
import { MirrorSchema } from "./src/database/schemas.ts";
import { Command, CommandArgument, GamerArgument } from "./src/helpers/commands.ts";
import { getTime } from "./src/helpers/utils.ts";

export const Gamer = enableHelpersPlugin(
  enablePermissionsPlugin(
    enableCachePlugin(
      (await createBot({
        token: configs.token,
        botId: BigInt(atob(configs.token.split(".")[0])),
        intents:
          Intents.Guilds |
          Intents.GuildMessages |
          Intents.DirectMessages |
          Intents.GuildMembers |
          Intents.GuildBans |
          Intents.GuildEmojis |
          Intents.GuildVoiceStates |
          Intents.GuildInvites |
          Intents.GuildMessageReactions |
          Intents.DirectMessageReactions |
          Intents.MessageContent,
        // Adds custom props like tasks and monitors to typings, add the actual ones below
      })) as GamerClient
    )
  )
);

enableCacheSweepers(Gamer);

// Add custom gamer only props
Gamer.arguments = new Collection();
Gamer.commands = new Collection();
Gamer.inhibitors = new Collection();
Gamer.monitors = new Collection();
Gamer.tasks = new Collection();
Gamer.guildPrefixes = new Collection();
Gamer.guildLanguages = new Collection();
Gamer.mirrors = new Collection();
Gamer.failedWebhooks = new Set();

Gamer.fullyReady = false;
Gamer.stats = {
  messagesProcessed: 0,
  messagesSent: 0,
  commandsRan: 0,
};

Gamer.tasks.forEach(async (task) => {
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
      if (!Gamer.fullyReady) return;

      console.log(`${bgBlue(`[${getTime()}]`)} => [TASK: ${bgYellow(black(task.name))}] Started.`);
      try {
        await task.execute();
      } catch (error) {
        console.log(error);
      }
    }, task.interval);
  }, Date.now() % task.interval);
});

export interface GamerClient extends Bot {
  fullyReady: boolean;
  stats: {
    messagesProcessed: number;
    messagesSent: number;
    commandsRan: number;
  };

  guildPrefixes: Collection<bigint, string>;
  guildLanguages: Collection<bigint, string>;

  mirrors: Collection<bigint, MirrorSchema[]>;
  failedWebhooks: Set<string>;

  arguments: Collection<string, GamerArgument>;
  commands: Collection<string, Command<any>>;
  inhibitors: Collection<string, GamerInhibitor>;
  monitors: Collection<string, GamerMonitor>;
  tasks: Collection<string, GamerTask>;
}

export interface GamerTask {
  name: string;
  interval: number;
  execute: () => any;
}

export interface GamerInhibitor {
  name: string;
  execute: (message: Message, command: Command<any>, guild?: Guild) => any;
}

export interface GamerMonitor {
  name: string;
  ignoreBots?: boolean;
  ignoreDM?: boolean;
  ignoreEdits?: boolean;
  ignoreOthers?: boolean;
  botChannelPermissions?: PermissionStrings[];
  botServerPermissions?: PermissionStrings[];
  userChannelPermissions?: PermissionStrings[];
  userServerPermissions?: PermissionStrings[];

  execute: (message: Message) => any;
}
