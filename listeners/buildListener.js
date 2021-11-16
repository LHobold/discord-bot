import getChannels from "../utils/getChannels.js";
import Build from "../commands/BuildClass.js";
import { prefix } from "../config/config.js";

export default (client) => {
  const build = new Build();

  return client.on("messageCreate", async (msg) => {
    const msgContent = msg.content.toLowerCase();
    const { slappersChannel } = getChannels(msg);

    if (!msgContent.trim().startsWith(`${prefix}b:`)) {
      return;
    }

    if (msgContent.trim().startsWith(`${prefix}b:`)) {
      try {
        const link = await build.sendBuildLink(msgContent);
        slappersChannel.send(link);
        await msg.delete();
      } catch (err) {
        slappersChannel.send(err.message);
      }
    }
  });
};
