import Gado from "../commands/GadoClass.js";
import Command from "../commands/CommandClass.js";
import { users, channels, prefix } from "../config/config.js";
import getChannels from "../utils/getChannels.js";
import dayjs from "../config/dayJs.js";

// Ids
const { robsId } = users;
const { slappersId } = channels;

export default (client, allowedDays) => {
  const gado = new Gado();
  const command = new Command();

  return client.on("messageCreate", async (msg) => {
    if (await command.checkMute("gadoMessageListener")) {
      return;
    }

    const curDay = dayjs().day();

    const msgContent = msg.content.toLowerCase();
    const toCheck = ["qual", "som", "gado"];
    const toCheckGado = ["quem", "gado"];

    if (toCheckGado.every((s) => msgContent.includes(s))) {
      return msg.reply("É o robs 🐂🐂🐂");
    }

    if (toCheck.every((s) => msgContent.includes(s))) {
      return msg.reply("Vamo joga um CS rapaziada");
    }

    if (msg.content.startsWith(`${prefix}resetG`)) {
      await msg.delete();
      await gado.resetGadancia();
    }

    if (!allowedDays.includes(curDay)) {
      return;
    }

    if (msg.channelId === slappersId && msg.author.id === robsId) {
      const { slappersChannel } = getChannels(msg);
      slappersChannel.send(`Robson gado de mais`).catch(console.error);
    }
  });
};
