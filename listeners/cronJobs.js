import cron from "cron";
import { gados, serverId, roles } from "../config/config.js";
import Gado from "../commands/GadoClass.js";
import { prefix } from "../config/config.js";
import getChannels from "../utils/getChannels.js";

export default (client, channelId) => {
  /// GADO JOBS ///
  const { gadoId: gadoRoleId } = roles;
  const gado = new Gado();

  const gadoMessage = new cron.CronJob(
    "00 30 21 * * 0",
    () => {
      gados.forEach(async (gadoId) => {
        const gadoUser = await gado.getGado(gadoId);

        if (!gadoUser) {
          console.error("No gado found, check id's");
          return;
        }

        const gadoTime = Math.ceil(gadoUser.gadoTime / (1000 * 60 * 60));
        const gadoName = gadoUser.name;

        client.channels.cache
          .get(channelId)
          .send(
            `${gadoName} gadou por ${gadoTime} horas esse final de semana.`
          );
      });
    },
    null,
    false,
    "America/Sao_Paulo"
  );

  const resetGagancia = new cron.CronJob(
    "00 0 2 * * 1",
    async () => {
      await gado.resetGadancia();
      gados.forEach(async (gadoId) => {
        const guild = client.guilds.cache.get(serverId);
        const role = guild.roles.cache.get(gadoRoleId);
        const member = await guild.members.fetch(gadoId);
        member.roles.remove(role);
      });
      console.log("Reseting gadancia");
    },
    null,
    false,
    "America/Sao_Paulo"
  );

  return client.on("messageCreate", async (msg) => {
    const { slappersChannel } = getChannels(msg);
    const msgContent = msg.content.trim();

    if (!msgContent.startsWith(`${prefix}cronJob`)) {
      return;
    }

    const cronJob = msgContent.split(":")[1].trim();
    const command = msgContent.split(":")[2].trim();

    if (command === "stop") {
      if (cronJob === "gadoMessage") {
        gadoMessage.stop();
      }

      if (cronJob === "resetGadancia") {
        resetGagancia.stop();
      }

      slappersChannel.send(`CronJob ${cronJob} desativado com sucesso!`);
    }

    if (command === "start") {
      if (cronJob === "gadoMessage") {
        gadoMessage.start();
      }

      if (cronJob === "resetGadancia") {
        resetGagancia.start();
      }

      slappersChannel.send(`CronJob ${cronJob} iniciado com sucesso!`);
    }

    if (command === "status") {
      let status;

      if (cronJob === "gadoMessage") {
        status = gadoMessage.running;
      }

      if (cronJob === "resetGadancia") {
        status = resetGagancia.start();
      }

      slappersChannel.send(
        `Status do cronJob ${cronJob}: ${status ? "Ativo" : "Desativado"}`
      );
    }
  });
};
