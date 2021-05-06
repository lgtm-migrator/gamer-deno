import { bot } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("settings-tags", {
  name: "mail",
  guildOnly: true,
  vipServerOnly: true,
  permissionLevels: [PermissionLevels.ADMIN],
  arguments: [
    {
      name: "name",
      type: "string",
      lowercase: true,
    },
  ],
  execute: async function (message, args) {
    const tagName = `${message.guildID}-${args.name}`;
    if (!bot.tagNames.has(tagName)) {
      return bot.helpers.reactError(message);
    }

    const tag = await db.tags.get(tagName);
    if (!tag) return bot.helpers.reactError(message);

    await db.tags.update(tagName, { mailOnly: !tag.mailOnly });

    return bot.helpers.reactSuccess(message);
  },
});
