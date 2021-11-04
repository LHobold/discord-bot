import dotenv from "dotenv";
dotenv.config({ path: ".env" });
import process from "process";
import Discord from "discord.js";
import questionsListener from "./listeners/questionsListener.js";
import saveLogs from "./commands/saveLogs.js";
import sendLogs from "./commands/sendLogs.js";
import fs from "fs-extra";
import getChannels from "./utils/getChannels.js";
import sendBuildLink from "./commands/sendBuildLink.js";
import { users, channels } from "./data/serverIds.js";
import gadoMsgListener from "./listeners/gadoMsgListener.js";
import gadoPresListener from "./listeners/gadoPresListener.js";
import aramListener from "./listeners/aramListener.js";
import getBackupLogs from "./functions/getBackupLogs.js";
import saveBackupLogs from "./functions/saveBackupLogs.js";
const logsPath = new URL("./logs/userStatusLog.json", import.meta.url);

// Ids
const { earlId, robsId, pauloId, thiagoId } = users;
const { slappersId, botModId, secretChannelId } = channels;

// Others
const allowedDays = [0, 6]; // Sat - Sun

const prefix = "!";

////////////////////////////////////////////////////

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

// Gado robson

gadoMsgListener(client, allowedDays);

// Aram listener

aramListener(client);

/////////// GENERAL MESSAGES ////////

client.on("messageCreate", async (msg) => {
  const msgContent = msg.content.toLowerCase();
  const { slappersChannel, secretChannel } = getChannels(msg);

  if (msgContent.trim().startsWith(`${prefix}b:`)) {
    try {
      const champName = msgContent.split(":")[1].trim();
      const link = await sendBuildLink(champName);
      slappersChannel.send(link);
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
  const userLogs = await fs.readJSON(logsPath);
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
