import dotenv from "dotenv";
dotenv.config({ path: ".env" });
import process from "process";
import Discord from "discord.js";
import questionsListener from "./listeners/questionsListener.js";
import Logs from "./commands/LogsClass.js";
import { users, channels, prefix, allowedDays } from "./config/config.js";
import gadoMsgListener from "./listeners/gadoMsgListener.js";
import gadoPresListener from "./listeners/gadoPresListener.js";
import aramListener from "./listeners/aramListener.js";
import getBackupLogs from "./functions/getBackupLogs.js";
import saveBackupLogs from "./functions/saveBackupLogs.js";
import userLeftRecently from "./utils/userLeftRecently.js";
import cronJobs from "./listeners/cronJobs.js";
import buildListener from "./listeners/buildListener.js";

// Ids
const { robsId, pauloId } = users;
const { slappersId } = channels;

////////////////////////////////////////////////////
process.on("SIGTERM", async () => {
  console.log("SIGTERM received. Saving logs and restarting!");
  await saveBackupLogs();
  console.log("Logs saved!");
});

const client = new Discord.Client({
  intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_PRESENCES"],
});
client.login(process.env.BOT_TOKEN);

/////////////////////// LISTENERS /////////////////

client.on("ready", async () => {
  await getBackupLogs();

  setInterval(async () => {
    console.log("Saving logs");
    await saveBackupLogs();
  }, (process.env.LOGS_BACKUP_INTERVAL || 8) * 3600000);

  client.user.setActivity("Free Fire");
  console.log("Ready");
});

/////////// GENERAL ////////
const logs = new Logs();

client.on("messageCreate", async (msg) => {
  const msgContent = msg.content.toLowerCase();

  if (msgContent.trim().startsWith(`${prefix}logs`)) {
    await msg.delete();
    await logs.sendLogs();
  }

  if (msgContent.trim().startsWith(`${prefix}updateLogs`)) {
    await msg.delete();
    await saveBackupLogs();
  }
});

client.on("presenceUpdate", async (oldMember, newMember) => {
  const isSpam = await userLeftRecently(newMember.user.id);

  if (newMember.status === "offline" && newMember.user.id !== robsId) {
    await logs.saveLogs(newMember);
  }

  if (isSpam) {
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

/////////////////////////////////////////////////////////////////////////////
////////////// GADO UPDATES ////////////////

gadoPresListener(client, allowedDays);
gadoMsgListener(client, allowedDays);

////////////// CRONO JOBS /////////////////

cronJobs(client, slappersId);

/////////////////// QUESTIONS LISTENER ///////////////////

questionsListener(client);

/////////////////// BUILD LISTENER ///////////////////

buildListener(client);

////// ARAM LISTENER /////////

aramListener(client);
