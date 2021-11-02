import dotenv from "dotenv";
dotenv.config({ path: ".env" });
import process from "process";
import Discord from "discord.js";
import questionsListener from "./questionsListener.js";
import { addPlayer, removePlayer } from "./commands/manageAramPlayers.js";
import saveLogs from "./commands/saveLogs.js";
import sendLogs from "./commands/sendLogs.js";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import sendBuildLink from "./commands/sendBuildLink.js";
import { users, channels, roles } from "./data/serverIds.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const logsPath = resolve(__dirname, "./logs/userStatusLog.json");

// Ids
const { earlId, robsId, pauloId, thiagoId } = users;
const { slappersId, botModId, secretChannelId } = channels;
const { gadoId } = roles;

// Others
const allowedDays = [0, 6]; // Sat - Sun

const prefix = "!";

////////////////////////////////////////////////////

const client = new Discord.Client({
  intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_PRESENCES"],
});
client.login(process.env.BOT_TOKEN);

process.on("SIGTERM", sendLogs);

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
  const msgContent = msg.content.toLowerCase();
  const slappersChannel = msg.guild.channels.cache.get(slappersId);
  const secretChannel = msg.guild.channels.cache.get(secretChannelId);
  const userLogs = JSON.parse(await fs.readFile(logsPath, "utf-8"));

  if (msgContent.trim().startsWith(`${prefix}b:`)) {
    try {
      const champName = msgContent.split(":")[1].trim();
      const link = await sendBuildLink(champName);
      slappersChannel.send(link);
    } catch (err) {
      slappersChannel.send(err.message);
    }
  }

  if (msgContent.trim() === `${prefix}pergunta add`) {
  }

  if (msgContent.trim() === `${prefix}aram`) {
    const aramPlayersId = userLogs.aram.map((id) => `<@${id}>`).join(" ");
    const message = `Bora de aramzada vermes ${aramPlayersId}`;

    slappersChannel.send(message);
  }

  if (msgContent.trim().startsWith(`${prefix}aram add:`)) {
    try {
      const newAramPlayerId = msgContent.split(":")[1].trim();
      await addPlayer(newAramPlayerId, msg.guild);
      message = `Verme adicionado com sucesso: <@${newAramPlayerId}>`;
      slappersChannel.send(message).catch(console.error);
    } catch (err) {
      slappersChannel.send(err.message);
    }
  }

  if (msgContent.trim().startsWith(`${prefix}aram remove:`)) {
    try {
      const newAramPlayerId = msgContent.split(":")[1].trim();
      await removePlayer(newAramPlayerId, msg.guild);
      message = `Verme removido com sucesso: <@${newAramPlayerId}>`;
      slappersChannel.send(message).catch(console.error);
    } catch (err) {
      slappersChannel.send(err.message);
    }
  }

  if (msgContent.trim().startsWith(`${prefix}logs`)) {
    await sendLogs();
  }
});

/////////////////// QUESTIONS LISTENER ///////////////////

questionsListener(client);

// Presence update //
////////////////// GENERAL UPDATES /////////////////////

client.on("presenceUpdate", async (oldMember, newMember) => {
  const userLogs = JSON.parse(await fs.readFile(logsPath, "utf-8"));
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
