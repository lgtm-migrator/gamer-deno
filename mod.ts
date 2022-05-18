import { configs } from "./configs.ts";
import {
  createBot,
  fileLoader,
  importDirectory,
  enableCachePlugin,
  enableHelpersPlugin,
  enableCacheSweepers,
  enablePermissionsPlugin,
  startBot,
} from "./deps.ts";

console.info("[Startup] Beginning Bot Startup Process...");

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
      })
    )
  )
);

enableCacheSweepers(Gamer);

// OVERRIDE INTERNALS HERE
// TODO: Transformers

// Load these first before anything else so they are available for the rest.
await importDirectory(Deno.realPathSync("./src/constants"));
await importDirectory(Deno.realPathSync("./src/helpers"));
await importDirectory(Deno.realPathSync("./src/events"));
await fileLoader();
if (!Gamer.events.ready) throw "No events loaded";

// The order of these is not important.
await Promise.all(
  [
    "./src/commands",
    "./src/inhibitors",
    "./src/arguments",
    "./src/monitors",
    "./src/tasks",
    "./src/permissionLevels",
  ].map((path) => importDirectory(Deno.realPathSync(path)))
);
await fileLoader();

// if (!Gamer.commands.size) throw "No commands loaded";
// if (!Gamer.arguments.size) throw "No args loaded";

console.info("Loading Languages...");
// Loads languages
// await loadLanguages();
console.info("Loading Database");

// await import("./src/database/database.ts");
console.log("Loaded Database, starting bot...");

startBot(Gamer);
