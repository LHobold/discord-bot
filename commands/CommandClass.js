/* eslint-disable no-unused-vars */
import fs from "fs-extra";

export default class Command {
  logsPath = new URL("../logs/userStatusLog.json", import.meta.url);

  async getUserLogs() {
    return await fs.readJSON(this.logsPath);
  }

  async checkMute(listener) {
    const userLogs = await this.getUserLogs();

    if (!(listener in userLogs.mute)) {
      throw new Error("Nenhum listener encontrado");
    }

    return userLogs.mute[listener];
  }

  async muteListener(msg) {
    const userLogs = await this.getUserLogs();
    const listener = msg.trim().split(":")[1];

    if (!(listener in userLogs.mute)) {
      throw new Error("Nenhum listener encontrado.");
    }

    userLogs.mute[listener] = !userLogs.mute[listener];

    await fs
      .writeFile(this.logsPath, JSON.stringify(userLogs))
      .catch(console.error);

    return `${listener} mutado com sucesso.`;
  }

  async listListener() {
    const userLogs = await this.getUserLogs();
    const listeners = userLogs.mute;
    let message = "Status dos listeners: \n";

    for (const listener in listeners) {
      message += `${listener}: ${
        listeners[listener] ? "Mutado" : "Ativado"
      } \n`;
    }

    return message;
  }
}
