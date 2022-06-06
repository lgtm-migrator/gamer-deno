import { Gamer } from "../../bot.ts";
import { Message } from "../../deps.ts";
import { EMOJIS } from "../constants/emojis.ts";

export async function reactSuccess(message: Message) {
  return Gamer.helpers.addReaction(message.channelId, message.id, EMOJIS.success).catch(console.log);
}
