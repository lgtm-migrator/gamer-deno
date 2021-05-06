import { bot, rawAvatarURL, sendDirectMessage } from "../../../../deps.ts";
import { createSubcommand, sendEmbed } from "../../../utils/helpers.ts";
import { Embed } from "../../../utils/Embed.ts";
import { db } from "../../../database/database.ts";

createSubcommand("surveys", {
  name: "fill",
  aliases: ["respond"],
  guildOnly: true,
  vipServerOnly: true,
  arguments: [{ name: "name", type: "string", lowercase: true }],
  execute: async function (message, args) {
    const survey = await db.surveys.get(`${message.guildID}-${args.name}`);
    if (!survey) return bot.helpers.reactError(message);

    if (!message.guildMember) return bot.helpers.reactError(message);

    if (!survey.allowedRoleIDs.some((id) => message.guildMember?.roles.includes(id))) {
      return bot.helpers.reactError(message);
    }

    const embed = new Embed().setAuthor(
      message.author.username,
      rawAvatarURL(message.author.id, message.author.discriminator, message.author.avatar)
    );

    // User has the role necessary to fill survey.
    for (const question of survey.questions) {
      await sendDirectMessage(message.author.id, question.question);
      // DM listener
      const response = await bot.helpers.needMessage(message.author.id, message.author.id);
      if (!response) return bot.helpers.reactError(message);

      // User gave a response
      const validate = await bot.arguments.get(question.type)?.execute({ name: "arg" }, [response.content], response, {
        name: "arg",
      });
      if (!validate) return bot.helpers.reactError(response);

      embed.addField(question.question, String(validate));
    }

    return sendEmbed(survey.channelID, embed);
  },
});
