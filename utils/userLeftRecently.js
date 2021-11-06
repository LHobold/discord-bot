import fs from "fs-extra";
const logsPath = new URL("../logs/userStatusLog.json", import.meta.url);

export default async (userId) => {
  const userLogs = await fs.readJSON(logsPath);
  const userLog = userLogs?.users.find((u) => u.id === userId);
  const userLeftAt = userLog ? userLog.leftAt : new Date().getTime();
  const userLeftRecently = new Date().getTime() < userLeftAt + 60 * 60 * 1000;
  return userLeftRecently;
};
