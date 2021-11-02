import fs from "fs/promises";
const logsPath = new URL("../logs/userStatusLog.json", import.meta.url);

export default async () => {
  const userLogsFile = await fs.readFile(logsPath, "utf-8");
  //   const userLogs = JSON.parse(userLogsFile);

  console.log(userLogsFile);
};
