import fs from "fs-extra";
import dayjs from "../config/dayJs.js";

export default class Gado {
  logsPath = new URL("../logs/userStatusLog.json", import.meta.url);

  async getLogsFile() {
    return fs.readJSON(this.logsPath);
  }

  async resetGadancia() {
    const logsFile = await this.getLogsFile();
    logsFile.users.forEach((u) => {
      u.gadoTime = 0;
    });
    await fs.writeJSON(this.logsPath, logsFile);
  }

  async getGado(userId) {
    const gado = (await this.getLogsFile()).users.find((u) => u.id === userId);
    return gado;
  }

  async addGadoTime(userId) {
    const logsFile = await this.getLogsFile();

    const gadoLogsIndex = logsFile.users.findIndex((u) => u.id === userId);
    const gadoLogs = logsFile.users[gadoLogsIndex];

    const leftAt = gadoLogs.leftAt;
    const gadandoTime = dayjs() - dayjs(leftAt);
    gadoLogs.gadoTime += gadandoTime;

    await fs.writeJSON(this.logsPath, logsFile);
  }
}
