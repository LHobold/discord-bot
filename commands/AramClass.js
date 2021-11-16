/* eslint-disable no-unused-vars */
import fs from "fs-extra";

export default class Aram {
  logsPath = new URL("../logs/userStatusLog.json", import.meta.url);

  async getUserLogs() {
    return await fs.readJSON(this.logsPath);
  }

  async addPlayer(id, guild) {
    const userLogs = await this.getUserLogs();
    await guild.members.fetch(id).catch((err) => {
      throw new Error("Nenhum verme com esse ID");
    });
    const aramPlayerIndex = userLogs.aram.findIndex((u) => u === id);

    if (aramPlayerIndex !== -1) {
      throw new Error("Esse verme já está na lista burro do caralho");
    }

    userLogs.aram.push(id);
    await fs
      .writeFile(this.logsPath, JSON.stringify(userLogs))
      .catch(console.error);
  }

  async removePlayer(id, guild) {
    const userLogs = await this.getUserLogs();

    await guild.members.fetch(id).catch((err) => {
      throw new Error("Nenhum verme com esse ID");
    });
    const aramPlayerIndex = userLogs.aram.findIndex((u) => u === id);

    if (aramPlayerIndex === -1) {
      throw new Error("Esse verme não está na lista burro do caralho");
    }

    const newAramPlayers = userLogs.aram.filter((u) => u !== id);
    userLogs.aram = newAramPlayers;
    await fs
      .writeFile(this.logsPath, JSON.stringify(userLogs))
      .catch(console.error);
  }

  async aramMessage() {
    const userLogs = await this.getUserLogs();
    const aramPlayersId =
      userLogs?.aram.map((id) => `<@${id}>`).join(" ") || [];
    return `Bora de aramzada vermes ${aramPlayersId}`;
  }
}
