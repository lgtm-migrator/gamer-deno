import { Gamer } from "./bot.ts";
import { fileLoader, importDirectory, startBot } from "./deps.ts";
import { setupBot } from "./src/helpers/startup.ts";

console.info("[Startup] Beginning Bot Startup Process...");

// OVERRIDE INTERNALS HERE
// TODO: Transformers

// Load these first before anything else so they are available for the rest.
setupBot();
console.log(`[Startup] Loaded initial files. Proceeding to phase 2 of startup.`);
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
