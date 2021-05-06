import { bot } from "../../deps.ts";
import { PermissionLevels } from "../types/commands.ts";

// The member using the command must be one of the bots dev team
bot.permissionLevels.set(PermissionLevels.MEMBER, async () => true);
