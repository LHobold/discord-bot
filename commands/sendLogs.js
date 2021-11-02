import fs from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const logsPath = resolve(__dirname, "../logs/userStatusLog.json");

export default async () => {
  const userLogsFile = await fs.readFile(logsPath, "utf-8");
  //   const userLogs = JSON.parse(userLogsFile);

  console.log(userLogsFile);
};
