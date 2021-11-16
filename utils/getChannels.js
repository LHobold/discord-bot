import { channels } from "../config/config.js";

const { slappersId, secretChannelId } = channels;

export default (obj) => {
  const slappersChannel = obj.guild.channels.cache.get(slappersId);
  const secretChannel = obj.guild.channels.cache.get(secretChannelId);

  return { slappersChannel, secretChannel };
};
