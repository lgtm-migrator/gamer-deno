import { Gamer } from "../../bot.ts";
import { Message, sendMessage, CreateMessage } from "../../deps.ts";

/** This function should be used when you want to send a response that will send a reply message. */
export async function sendResponse(message: Message, content: string | CreateMessage) {
  const contentWithMention =
    typeof content === "string"
      ? { content, mentions: { repliedUser: true }, replyMessageID: message.id }
      : {
          ...content,
          allowedMentions: { ...(content.allowedMentions || {}), repliedUser: true },
          replyMessageID: message.id,
        };

  return await Gamer.helpers.sendMessage(message.channelId, contentWithMention).catch(console.log);
}
