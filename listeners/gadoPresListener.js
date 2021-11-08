import { users, channels, roles } from "../data/serverIds.js";
import userLeftRecently from "../utils/userLeftRecently.js";
import getChannels from "../utils/getChannels.js";
import Logs from "../commands/LogsClass.js";
import Gado from "../commands/GadoClass.js";

// Ids
const { earlId, robsId, pauloId, thiagoId } = users;
const { gadoId } = roles;

export default (client, allowedDays) => {
  const logs = new Logs();
  const gado = new Gado();

  return client.on("presenceUpdate", async (oldMember, newMember) => {
    if (newMember.user.id !== robsId) {
      return;
    }
    const gadoRole = newMember.guild.roles.cache.get(gadoId);
    const isSpam = await userLeftRecently(newMember.user.id);
    const { slappersChannel } = getChannels(newMember);

    const curDay = new Date(
      new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo" })
    ).getDay();

    if (!allowedDays.includes(curDay)) {
      return;
    }

    if (
      newMember.status === "online" &&
      (oldMember.status === "offline" || oldMember.status === "idle")
    ) {
      newMember.member.roles.remove(gadoRole);
      await gado.addGadoTime(newMember.user.id);
      await logs.saveLogs(newMember);

      if (isSpam) {
        return;
      }

      slappersChannel
        .send(`O gado está online 🐂🐂🐂 <@${robsId}>`)
        .catch(console.error);
    }

    if (newMember.status === "idle") {
      newMember.member.roles.add(gadoRole);
      await logs.saveLogs(newMember);

      if (isSpam) {
        return;
      }

      slappersChannel
        .send(`<@${robsId}> foi gadar 🐂🐂🐂 `)
        .catch(console.error);
    }
  });
};
