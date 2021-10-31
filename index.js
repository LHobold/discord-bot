import dotenv from "dotenv";
dotenv.config({ path: ".env" });
import Discord from "discord.js";
import { addPlayer, removePlayer } from "./utils/manageAramPlayers.js";
import upperName from "./utils/upperName.js";
import saveLogs from "./utils/saveLogs.js";
import sendLogs from "./utils/sendLogs.js";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const logsPath = resolve(__dirname, "./logs/userStatusLog.json");

// Users
const robsId = "232157423081619457";
const earlId = "232189605414305795";
const pauloId = "232157488529670145";
const thiagoId = "232232173317390336";

// Channels
const slappersId = "869363826540281916";
const botModId = "869364246213967882";
const secretChannelId = "719721295452832093";

// Roles
const gadoId = "898985262770688111";

// Others
const allowedDays = [0, 6]; // Sat - Sun

const prefix = "!";

////////////////////////////////////////////////////

const client = new Discord.Client({
  intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_PRESENCES"],
});
client.login(process.env.BOT_TOKEN);

/////////////////////// LISTENERS /////////////////

client.on("ready", () => {
  client.user.setActivity("Free Fire");
  console.log("Ready");
});

// Gado robson

client.on("messageCreate", async (msg) => {
  const curDay = new Date(
    new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo" })
  ).getDay();

  const msgContent = msg.content.toLowerCase();
  const toCheck = ["qual", "som", "gado"];
  const toCheckGado = ["quem", "gado"];

  if (toCheckGado.every((s) => msgContent.includes(s))) {
    return msg.reply("É o robs 🐂🐂🐂");
  }

  if (toCheck.every((s) => msgContent.includes(s))) {
    return msg.reply("Vamo joga um CS rapaziada");
  }

  if (!allowedDays.includes(curDay)) {
    return;
  }

  if ((msg.channelId = slappersId && msg.author.id === robsId)) {
    const slappersChannel = msg.guild.channels.cache.get(slappersId);
    slappersChannel.send(`Gado de mais`).catch(console.error);
  }
});

/////////// GENERAL MESSAGES ////////

client.on("messageCreate", async (msg) => {
  const guild = msg.guild;
  const slappersChannel = msg.guild.channels.cache.get(slappersId);
  const secretChannel = msg.guild.channels.cache.get(secretChannelId);
  const userLogsFile = await fs.readFile(logsPath, "utf-8");
  const userLogs = JSON.parse(userLogsFile);

  const msgContent = msg.content.toLowerCase();

  if (msgContent.trim().startsWith(`${prefix}b:`)) {
    let champName = msgContent.split(":")[1].trim();

    if (champName.includes("'")) {
      const nameArr = champName.split("'");
      champName = upperName(nameArr[0]) + upperName(nameArr[1]);
    } else {
      champName = upperName(champName);
    }

    const link = `https://www.lolvvv.com/pt/champion/${champName}/probuilds`;

    slappersChannel.send(link).catch(console.error);
  }

  if (msgContent.trim() === `${prefix}aram`) {
    const aramPlayersId = userLogs.aram.map((id) => `<@${id}>`).join(" ");
    const message = `Bora de aramzada vermes ${aramPlayersId}`;

    slappersChannel.send(message).catch(console.error);
  }

  if (msgContent.trim().startsWith(`${prefix}aram add:`)) {
    let message = "Nenhum verme com esse ID";
    const newAramPlayerId = msgContent.split(":")[1].trim();

    const userExists = await guild.members
      .fetch(newAramPlayerId)
      .catch((err) => {
        slappersChannel.send(message);
        return null;
      });

    if (!userExists) {
      return;
    }

    const sucess = await addPlayer(newAramPlayerId).catch((err) => {
      slappersChannel.send(err.message);
      return null;
    });

    if (!sucess) {
      return;
    }

    message = `Verme adicionado com sucesso: <@${newAramPlayerId}>`;
    slappersChannel.send(message).catch(console.error);
  }

  if (msgContent.trim().startsWith(`${prefix}aram remove:`)) {
    let message = "Nenhum verme com esse ID";
    const newAramPlayerId = msgContent.split(":")[1].trim();

    const userExists = await guild.members
      .fetch(newAramPlayerId)
      .catch((er) => {
        slappersChannel.send(message);
        return null;
      });

    if (!userExists) {
      return;
    }

    const sucess = await removePlayer(newAramPlayerId).catch((err) => {
      slappersChannel.send(err.message);
      return null;
    });

    if (!sucess) {
      return;
    }

    message = `Verme removido com sucesso: <@${newAramPlayerId}>`;
    slappersChannel.send(message).catch(console.error);
  }

  if (msgContent.trim().startsWith(`${prefix}logs`)) {
    await sendLogs();
  }
});

// Presence update //
////////////////// GENERAL UPDATES /////////////////////

client.on("presenceUpdate", async (oldMember, newMember) => {
  const userLogsFile = await fs.readFile(logsPath, "utf-8");
  const userLogs = JSON.parse(userLogsFile);
  const userLog = userLogs.users.find((u) => u.id === newMember.user.id);
  const userLeftAt = userLog ? userLog.leftAt : new Date().getTime();
  const userLeftRecently = new Date().getTime() < userLeftAt + 60 * 60 * 1000;

  if (newMember.status === "offline") {
    await saveLogs(newMember);
  }

  if (userLeftRecently) {
    return;
  }

  if (
    oldMember &&
    (oldMember?.status === "online" || oldMember?.status === "idle") &&
    newMember.userId === pauloId &&
    newMember.status === "offline"
  ) {
    const slappersChannel = newMember.guild.channels.cache.get(slappersId);
    slappersChannel
      .send(`Não tinha ninguém on então o <@${pauloId}> foi dormir`)
      .catch(console.error);
  }
});

////////////// GADO UPDATES ////////////////

client.on("presenceUpdate", (oldMember, newMember) => {
  const curDay = new Date(
    new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo" })
  ).getDay();

  if (!allowedDays.includes(curDay)) {
    return;
  }

  if (newMember.status === "online" && newMember.userId === robsId) {
    const slappersChannel = newMember.guild.channels.cache.get(slappersId);
    slappersChannel
      .send(`O gado está online 🐂🐂🐂 <@${robsId}>`)
      .catch(console.error);

    const gadoRole = newMember.guild.roles.cache.get(gadoId);
    newMember.member.roles.remove(gadoRole);
  }

  if (newMember.status === "idle" && newMember.userId === robsId) {
    const slappersChannel = newMember.guild.channels.cache.get(slappersId);
    slappersChannel.send(`<@${robsId}> foi gadar 🐂🐂🐂 `).catch(console.error);

    const gadoRole = newMember.guild.roles.cache.get(gadoId);
    newMember.member.roles.add(gadoRole);
  }
});
