import { channels } from "../data/serverIds.js";

const { slappersId, botModId, secretChannelId } = channels;

export default (obj) => {
  const slappersChannel = obj.guild.channels.cache.get(slappersId);
  const secretChannel = obj.guild.channels.cache.get(secretChannelId);

  return { slappersChannel, secretChannel };
};
