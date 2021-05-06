import { bot, cache } from "../../../deps.ts";
import { db } from "../../database/database.ts";
import { PermissionLevels } from "../../types/commands.ts";
import { createSubcommand } from "../../utils/helpers.ts";

createSubcommand("settings", {
  name: "reset",
  guildOnly: true,
  permissionLevels: [PermissionLevels.SERVER_OWNER],
  execute: async function (message, _args, guild) {
    if (!guild) return;

    // REMOVE ALL GUILD RELATED STUFF FROM CACHE
    bot.analyticsDetails.forEach(async (value, key) => {
      const [x, guildID] = key.split("-");
      if (guildID === message.guildID) bot.analyticsDetails.delete(key);
    });
    bot.analyticsMemberJoin.delete(message.guildID);
    bot.analyticsMemberLeft.delete(message.guildID);
    bot.analyticsMessages.delete(message.guildID);
    bot.autoEmbedChannelIDs.forEach(async (id) => {
      const channel = cache.channels.get(id);
      if (channel?.guildID === message.guildID) {
        return bot.autoEmbedChannelIDs.delete(id);
      }
    });
    bot.commandPermissions.forEach(async (perm, key) => {
      if (perm.guildID === message.guildID) {
        bot.commandPermissions.delete(key);
      }
    });
    bot.guildLanguages.delete(message.guildID);
    bot.guildPrefixes.delete(message.guildID);
    bot.guildsXPPerMessage.delete(message.guildID);
    bot.guildsXPPerMinuteVoice.delete(message.guildID);
    bot.guildSupportChannelIDs.forEach(async (id) => {
      const channel = cache.channels.get(id);
      if (channel?.guildID === message.guildID) {
        return bot.guildSupportChannelIDs.delete(id);
      }
    });
    bot.invites.forEach(async (invite, key) => {
      if (invite.guildID === message.guildID) bot.invites.delete(key);
    });
    bot.mirrors.forEach(async (mirrors, key) => {
      mirrors.forEach(async (mirror) => {
        if (mirror.sourceGuildID === message.guildID) {
          bot.mirrors.delete(key);
        }
        if (mirror.sourceGuildID === message.guildID) {
          bot.mirrors.delete(key);
        }
        if (mirror.mirrorGuildID === message.guildID) {
          bot.mirrors.delete(key);
        }
      });
    });
    bot.missionsDisabledGuildIDs.delete(message.guildID);
    bot.tenorDisabledGuildIDs.delete(message.guildID);
    bot.xpEnabledGuildIDs.delete(message.guildID);

    // REMOVE ALL GUILD RELATED STUFF FROM DATABASE
    await Promise.all([
      db.aggregatedanalytics.deleteMany({ guildID: message.guildID }),
      db.analytics.delete(message.guildID),
      db.autoreact.deleteMany({ guildID: message.guildID }),
      db.commands.deleteMany({ guildID: message.guildID }),
      db.counting.deleteMany({ guildID: message.guildID }),
      db.defaultrolesets.deleteMany({ guildID: message.guildID }),
      db.emojis.deleteMany({ guildID: message.guildID }),
      db.events.deleteMany({ guildID: message.guildID }),
      db.feedbacks.deleteMany({ guildID: message.guildID }),
      db.giveaways.deleteMany({ guildID: message.guildID }),
      db.groupedrolesets.deleteMany({ guildID: message.guildID }),
      db.guilds.delete(message.guildID),
      db.labels.deleteMany({ guildID: message.guildID }),
      db.levels.deleteMany({ guildID: message.guildID }),
      db.mails.deleteMany({ guildID: message.guildID }),
      db.mirrors.deleteMany({ sourceGuildID: message.guildID }),
      db.mirrors.deleteMany({ sourceGuildID: message.guildID }),
      db.mirrors.deleteMany({ mirrorGuildID: message.guildID }),
      db.modlogs.deleteMany({ guildID: message.guildID }),
      db.modules.deleteMany({ guildID: message.guildID }),
      db.mutes.deleteMany({ guildID: message.guildID }),
      db.polls.deleteMany({ guildID: message.guildID }),
      db.reactionroles.deleteMany({ guildID: message.guildID }),
      db.reminders.deleteMany({ guildID: message.guildID }),
      db.requiredrolesets.deleteMany({ guildID: message.guildID }),
      db.rolemessages.deleteMany({ guildID: message.guildID }),
      db.serverlogs.delete(message.guildID),
      db.shortcuts.deleteMany({ guildID: message.guildID }),
      db.surveys.deleteMany({ guildID: message.guildID }),
      db.tags.deleteMany({ guildID: message.guildID }),
      db.uniquerolesets.deleteMany({ guildID: message.guildID }),
      db.welcome.delete(message.guildID),
      db.xp.deleteMany({ guildID: message.guildID }),
    ]);

    // ALERTS ARE HANDLED SPECIALLY
    const [facebook, instagram, manga, reddit, twitch, twitter, youtube] = await Promise.all([
      await db.facebook.getAll(true),
      await db.instagram.getAll(true),
      await db.manga.getAll(true),
      await db.reddit.getAll(true),
      await db.twitch.getAll(true),
      await db.twitter.getAll(true),
      await db.youtube.getAll(true),
    ]);

    for (const alert of facebook) {
      if (!alert.subscriptions.some((sub) => sub.guildID === message.guildID)) {
        continue;
      }
      await db.facebook.update(alert.id, {
        subscriptions: alert.subscriptions.filter((sub) => sub.guildID !== message.guildID),
      });
    }

    for (const alert of instagram) {
      if (!alert.subscriptions.some((sub) => sub.guildID === message.guildID)) {
        continue;
      }
      await db.instagram.update(alert.id, {
        subscriptions: alert.subscriptions.filter((sub) => sub.guildID !== message.guildID),
      });
    }

    for (const alert of manga) {
      if (!alert.subscriptions.some((sub) => sub.guildID === message.guildID)) {
        continue;
      }
      await db.manga.update(alert.id, {
        subscriptions: alert.subscriptions.filter((sub) => sub.guildID !== message.guildID),
      });
    }

    for (const alert of reddit) {
      if (!alert.subscriptions.some((sub) => sub.guildID === message.guildID)) {
        continue;
      }
      await db.reddit.update(alert.id, {
        subscriptions: alert.subscriptions.filter((sub) => sub.guildID !== message.guildID),
      });
    }

    for (const alert of twitch) {
      if (!alert.subscriptions.some((sub) => sub.guildID === message.guildID)) {
        continue;
      }
      await db.twitch.update(alert.id, {
        subscriptions: alert.subscriptions.filter((sub) => sub.guildID !== message.guildID),
      });
    }

    for (const alert of twitter) {
      if (!alert.subscriptions.some((sub) => sub.guildID === message.guildID)) {
        continue;
      }
      await db.twitter.update(alert.id, {
        subscriptions: alert.subscriptions.filter((sub) => sub.guildID !== message.guildID),
      });
    }

    for (const alert of youtube) {
      if (!alert.subscriptions.some((sub) => sub.guildID === message.guildID)) {
        continue;
      }
      await db.youtube.update(alert.id, {
        subscriptions: alert.subscriptions.filter((sub) => sub.guildID !== message.guildID),
      });
    }

    return bot.helpers.reactSuccess(message);
  },
});
