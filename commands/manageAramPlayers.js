import fs from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const logsPath = resolve(__dirname, "../logs/userStatusLog.json");

export async function addPlayer(id, guild) {
  const userLogsFile = await fs.readFile(logsPath, "utf-8");
  const userLogs = JSON.parse(userLogsFile);

  await guild.members.fetch(id).catch((err) => {
    throw new Error("Nenhum verme com esse ID");
  });

  const aramPlayerIndex = userLogs.aram.findIndex((u) => u === id);

  if (aramPlayerIndex !== -1) {
    throw new Error("Esse verme já está na lista burro do caralho");
  }

  userLogs.aram.push(id);

  await fs.writeFile(logsPath, JSON.stringify(userLogs)).catch(console.error);

  return true;
}

export async function removePlayer(id, guild) {
  const userLogsFile = await fs.readFile(logsPath, "utf-8");
  const userLogs = JSON.parse(userLogsFile);

  await guild.members.fetch(id).catch((err) => {
    throw new Error("Nenhum verme com esse ID");
  });

  const aramPlayerIndex = userLogs.aram.findIndex((u) => u === id);

  if (aramPlayerIndex === -1) {
    throw new Error("Esse verme não está na lista burro do caralho");
  }

  const newAramPlayers = userLogs.aram.filter((u) => u !== id);
  userLogs.aram = newAramPlayers;

  await fs.writeFile(logsPath, JSON.stringify(userLogs)).catch(console.error);

  return true;
}
