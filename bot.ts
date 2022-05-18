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
} from "./deps.ts";
import { getTime } from "./src/helpers/utils.ts";

export const Gamer = enableHelpersPlugin(
  enablePermissionsPlugin(
    enableCachePlugin(
      createBot({
        token: configs.token,
        botId: BigInt(atob(configs.token.split(".")[0])),
        intents: [
          "Guilds",
          "GuildMessages",
          "DirectMessages",
          "GuildMembers",
          "GuildBans",
          "GuildEmojis",
          "GuildVoiceStates",
          "GuildInvites",
          "GuildMessageReactions",
          "DirectMessageReactions",
          "MessageContent",
        ],
        // Events are added below automatically before starting the bot
        events: {},
        // Adds custom props like tasks and monitors to typings, add the actual ones below
      }) as GamerClient
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
Gamer.fullyReady = false;
Gamer.stats = {
  messagesProcessed: 0,
  messagesSent: 0,
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
  };

  arguments: Collection<string, GamerArgument>;
  commands: Collection<string, GamerCommand>;
  inhibitors: Collection<string, GamerInhibitor>;
  monitors: Collection<string, GamerMonitor>;
  tasks: Collection<string, GamerTask>;
}

export interface GamerTask {
  name: string;
  interval: number;
  execute: () => any;
}

export interface GamerArgument {
  name: string;
  execute: () => any;
}

export interface GamerCommand {
  name: string;
  execute: () => any;
}

export interface GamerInhibitor {
  name: string;
  execute: () => any;
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
