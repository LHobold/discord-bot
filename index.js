import dotenv from "dotenv";
dotenv.config({ path: ".env" });
import process from "process";
import Discord from "discord.js";
import questionsListener from "./listeners/questionsListener.js";
import { addPlayer, removePlayer } from "./commands/manageAramPlayers.js";
import saveLogs from "./commands/saveLogs.js";
import sendLogs from "./commands/sendLogs.js";
import fs from "fs-extra";
import sendBuildLink from "./commands/sendBuildLink.js";
import { users, channels, roles } from "./data/serverIds.js";
import gadoMsgListener from "./listeners/gadoMsgListener.js";
import gadoPresListener from "./listeners/gadoPresListener.js";
const logsPath = new URL("./logs/userStatusLog.json", import.meta.url);

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

process.on("SIGTERM", async () => await sendLogs());

/////////////////////// LISTENERS /////////////////

client.on("ready", () => {
  client.user.setActivity("Free Fire");
  console.log("Ready");
});

// Gado robson

gadoMsgListener(client, allowedDays);

/////////// GENERAL MESSAGES ////////

client.on("messageCreate", async (msg) => {
  const msgContent = msg.content.toLowerCase();
  const slappersChannel = msg.guild.channels.cache.get(slappersId);
  const secretChannel = msg.guild.channels.cache.get(secretChannelId);

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
    const userLogs = await fs.readJSON(logsPath);
    const aramPlayersId = userLogs.aram.map((id) => `<@${id}>`).join(" ");
    const message = `Bora de aramzada vermes ${aramPlayersId}`;

    slappersChannel.send(message);
  }

  if (msgContent.trim().startsWith(`${prefix}aram add:`)) {
    try {
      const newAramPlayerId = msgContent.split(":")[1].trim();
      await addPlayer(newAramPlayerId, msg.guild);
      const message = `Verme adicionado com sucesso: <@${newAramPlayerId}>`;
      slappersChannel.send(message).catch(console.error);
    } catch (err) {
      slappersChannel.send(err.message);
    }
  }

  if (msgContent.trim().startsWith(`${prefix}aram remove:`)) {
    try {
      const newAramPlayerId = msgContent.split(":")[1].trim();
      await removePlayer(newAramPlayerId, msg.guild);
      const message = `Verme removido com sucesso: <@${newAramPlayerId}>`;
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

gadoPresListener(client, allowedDays);
