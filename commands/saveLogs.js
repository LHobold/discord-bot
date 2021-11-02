import fs from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const logsPath = resolve(__dirname, "../logs/userStatusLog.json");

export default async (newMember) => {
  const userLogsFile = await fs.readFile(logsPath, "utf-8");
  const userLogs = JSON.parse(userLogsFile);

  const userLogObj = {
    id: newMember.user.id,
    name: newMember.user.username,
    leftAt: new Date().getTime(),
  };

  const userIndex = userLogs.users.findIndex((u) => u.id === userLogObj.id);

  userIndex === -1
    ? userLogs.users.push(userLogObj)
    : (userLogs.users[userIndex] = userLogObj);

  await fs.writeFile(logsPath, JSON.stringify(userLogs)).catch(console.error);
};
