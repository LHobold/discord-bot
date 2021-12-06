import fs from "fs-extra";
import dayjsSA from "../config/dayJs.js";
import dayjs from "dayjs";
const logsPath = new URL("../logs/userStatusLog.json", import.meta.url);

export default async (userId) => {
  const userLogs = await fs.readJSON(logsPath);
  const userLog = userLogs?.users.find((u) => u.id === userId);
  const userLeftAt = userLog ? dayjs(userLog.leftAt) : dayjs();
  const curDate = dayjsSA();
  const userLeftRecently = curDate < userLeftAt + 60 * 60 * 1000;
  return userLeftRecently;
};
