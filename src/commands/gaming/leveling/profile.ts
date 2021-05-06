import { bot } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { createCommand, humanizeMilliseconds } from "../../../utils/helpers.ts";
import { translate } from "../../../utils/i18next.ts";

createCommand({
  name: "profile",
  aliases: ["p", "prof"],
  guildOnly: true,
  botChannelPermissions: ["VIEW_CHANNEL", "SEND_MESSAGES", "ATTACH_FILES", "EMBED_LINKS"],
  arguments: [{ name: "member", type: "member", required: false }] as const,
  execute: async function (message, args) {
    const memberID = args.member?.id || message.author.id;

    const buffer = await bot.helpers.makeProfileCanvas(message.guildID, memberID);
    if (!buffer) return;

    const embed = bot.helpers.authorEmbed(message).attachFile(buffer, "profile.jpg");

    const settings = await db.guilds.get(message.guildID);
    if (!settings?.missionsDisabled) {
      const missions = await Promise.all(
        bot.missions.map(async (mission, index) => {
          if (index > 2 && !bot.activeMembersOnSupportServer.has(memberID) && !bot.vipUserIDs.has(memberID)) {
            return `❓ || ${bot.constants.botSupportInvite} ||`;
          }

          const relevantMission = await db.mission.get(`${memberID}-${mission.commandName}`);
          if (!relevantMission) {
            return `0 / ${mission.amount} : ${translate(message.guildID, mission.title)} **[${mission.reward}] XP**`;
          }

          if (!relevantMission.completed) {
            return `${relevantMission.amount} / ${mission.amount} : ${translate(message.guildID, mission.title)} **[${
              mission.reward
            }] XP**`;
          }
          return `${bot.constants.emojis.success}: ${translate(message.guildID, mission.title)} **[${
            mission.reward
          }] XP**`;
        })
      );

      embed.setDescription(missions.join("\n")).setFooter(
        translate(message.guildID, `strings:NEW_IN`, {
          time: humanizeMilliseconds(bot.constants.milliseconds.MINUTE * 30 - (Date.now() - bot.missionStartedAt)),
        })
      );
    }

    return message.send({ embed, file: embed.embedFile });
  },
});
