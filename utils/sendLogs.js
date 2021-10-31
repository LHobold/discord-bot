import fs from "fs/promises";
import path from "path";
import fetch from "node-fetch";
import { fileURLToPath } from "url";
import { dirname } from "path";
import FormData from "form-data";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const logsPath = path.resolve(__dirname, "../logs/userStatusLog.json");

export default async () => {
  const userLogsFile = await fs.readFile(logsPath, "utf-8");
  //   const userLogs = JSON.parse(userLogsFile);

  console.log(userLogsFile);
};
