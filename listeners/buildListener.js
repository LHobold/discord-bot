import getChannels from "../utils/getChannels.js";
import Build from "../commands/BuildClass.js";

export default (client) => {
  const build = new Build();

  return client.on("messageCreate", async (msg) => {
    const msgContent = msg.content.toLowerCase();
    const { slappersChannel, secretChannel } = getChannels(msg);

    if (!msgContent.trim().startsWith(`!b:`)) {
      return;
    }

    if (msgContent.trim().startsWith(`!b:`)) {
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
