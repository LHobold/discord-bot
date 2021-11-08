import getChannels from "../utils/getChannels.js";
import Aram from "../commands/AramClass.js";

export default (client) => {
  const aram = new Aram();

  return client.on("messageCreate", async (msg) => {
    const prefix = "!";
    const msgContent = msg.content.toLowerCase();
    const { slappersChannel, secretChannel } = getChannels(msg);

    if (!msgContent.trim().startsWith(prefix)) {
      return;
    }

    if (msgContent.trim() === `${prefix}aram`) {
      const message = await aram.aramMessage();
      slappersChannel.send(message);
    }

    if (msgContent.trim().startsWith(`${prefix}aram add:`)) {
      try {
        const newAramPlayerId = msgContent.split(":")[1]?.trim();
        await aram.addPlayer(newAramPlayerId, msg.guild);
        const message = `Verme adicionado com sucesso: <@${newAramPlayerId}>`;
        slappersChannel.send(message).catch(console.error);
      } catch (err) {
        slappersChannel.send(err.message);
      }
    }

    if (msgContent.trim().startsWith(`${prefix}aram remove:`)) {
      try {
        const newAramPlayerId = msgContent.split(":")[1]?.trim();
        await aram.removePlayer(newAramPlayerId, msg.guild);
        const message = `Verme removido com sucesso: <@${newAramPlayerId}>`;
        slappersChannel.send(message).catch(console.error);
      } catch (err) {
        slappersChannel.send(err.message);
      }
    }

    await msg.delete();
  });
};
