import getChannels from "../utils/getChannels.js";
import { addPlayer, removePlayer } from "../commands/manageAramPlayers.js";
const logsPath = new URL("../logs/userStatusLog.json", import.meta.url);
import fs from "fs-extra";

export default (client) => {
  return client.on("messageCreate", async (msg) => {
    const prefix = "!";
    const msgContent = msg.content.toLowerCase();
    const { slappersChannel, secretChannel } = getChannels(msg);

    if (msgContent.trim() === `${prefix}aram`) {
      const userLogs = await fs.readJSON(logsPath);
      const aramPlayersId =
        userLogs?.aram.map((id) => `<@${id}>`).join(" ") || [];
      const message = `Bora de aramzada vermes ${aramPlayersId}`;

      slappersChannel.send(message);
    }

    if (msgContent.trim().startsWith(`${prefix}aram add:`)) {
      try {
        const newAramPlayerId = msgContent.split(":")[1]?.trim();
        await addPlayer(newAramPlayerId, msg.guild);
        const message = `Verme adicionado com sucesso: <@${newAramPlayerId}>`;
        slappersChannel.send(message).catch(console.error);
      } catch (err) {
        slappersChannel.send(err.message);
      }
    }

    if (msgContent.trim().startsWith(`${prefix}aram remove:`)) {
      try {
        const newAramPlayerId = msgContent.split(":")[1]?.trim();
        await removePlayer(newAramPlayerId, msg.guild);
        const message = `Verme removido com sucesso: <@${newAramPlayerId}>`;
        slappersChannel.send(message).catch(console.error);
      } catch (err) {
        slappersChannel.send(err.message);
      }
    }
  });
};
