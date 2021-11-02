import { users, channels, roles } from "../data/serverIds.js";

// Ids
const { earlId, robsId, pauloId, thiagoId } = users;
const { slappersId, botModId, secretChannelId } = channels;

export default (client, allowedDays) => {
  return client.on("messageCreate", async (msg) => {
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

    if (msg.channelId === slappersId && msg.author.id === robsId) {
      const slappersChannel = msg.guild.channels.cache.get(slappersId);
      slappersChannel.send(`Robson gado de mais`).catch(console.error);
    }
  });
};
