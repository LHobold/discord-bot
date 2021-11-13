import fs from "fs-extra";

export default class Logs {
  logsPath = new URL("../logs/userStatusLog.json", import.meta.url);

  async getLogsFile() {
    return fs.readJSON(this.logsPath);
  }

  async saveLogs(newMember) {
    const userLogs = await this.getLogsFile();
    const userIndex = userLogs.users.findIndex(
      (u) => u.id === newMember.user.id
    );
    const gadoTime = userLogs.users[userIndex]?.gadoTime || 0;

    const userLogObj = {
      id: newMember.user.id,
      name: newMember.user.username,
      leftAt: new Date(
        new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo" })
      ).getTime(),
      gadoTime,
    };

    userIndex === -1
      ? userLogs.users.push(userLogObj)
      : (userLogs.users[userIndex] = userLogObj);

    await fs.writeJSON(this.logsPath, userLogs).catch(console.error);
  }

  async sendLogs() {
    const userLogsFile = await this.getLogsFile();
    console.log(userLogsFile);
  }
}
