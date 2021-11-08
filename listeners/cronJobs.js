import cron from "cron";
import { gados } from "../data/serverIds.js";
import Gado from "../commands/GadoClass.js";

export default (client, channelId) => {
  /// GADO JOBS ///
  const gado = new Gado();

  const sendWeekendGadancia = new cron.CronJob(
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
    true,
    "America/Sao_Paulo"
  );

  const resetWeekendGadancia = new cron.CronJob(
    "00 0 2 * * 1",
    async () => {
      await gado.resetGadancia();
      console.log("Resetting gadancia");
    },
    null,
    true,
    "America/Sao_Paulo"
  );
};