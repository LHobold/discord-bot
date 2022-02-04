import getChannels from "../utils/getChannels.js";
import Command from "../commands/CommandClass.js";
import { prefix, users } from "../config/config.js";

export default (client) => {
  const command = new Command();

  return client.on("messageCreate", async (msg) => {
    const msgContent = msg.content.toLowerCase();
    const { slappersChannel } = getChannels(msg);

    if (!msgContent.trim().startsWith(`${prefix}mute`)) {
      return;
    }

    if (msg.member.user.id != users.earlId) {
      try {
        const message = "Somente o Earl pode mudar a configuração do bot.";
        slappersChannel.send(message);
        await msg.delete();
      } catch (err) {
        slappersChannel.send(err.message);
      }

      return;
    }

    if (msgContent.trim().startsWith(`${prefix}mute:`)) {
      try {
        const message = await command.muteListener(msgContent);
        slappersChannel.send(message);
        await msg.delete();
      } catch (err) {
        slappersChannel.send(err.message);
      }
    }

    if (msgContent.trim().startsWith(`${prefix}mutestatus`)) {
      try {
        const message = await command.listListener();
        slappersChannel.send(message);
        await msg.delete();
      } catch (err) {
        slappersChannel.send(err.message);
      }
    }
  });
};
