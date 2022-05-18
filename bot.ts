import { configs } from "./configs.ts";
import {
  createBot,
  enableCachePlugin,
  enableHelpersPlugin,
  enableCacheSweepers,
  enablePermissionsPlugin,
  Bot,
  Collection,
} from "./deps.ts";

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

export interface GamerClient extends Bot {
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
  execute: () => any;
}
