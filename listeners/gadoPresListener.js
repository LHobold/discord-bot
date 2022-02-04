import { users, roles } from "../config/config.js";
import userLeftRecently from "../utils/userLeftRecently.js";
import getChannels from "../utils/getChannels.js";
import Logs from "../commands/LogsClass.js";
import Gado from "../commands/GadoClass.js";
import Command from "../commands/CommandClass.js";
import dayjs from "../config/dayJs.js";

// Ids
const { robsId } = users;
const { gadoId } = roles;

export default (client, allowedDays) => {
  const logs = new Logs();
  const gado = new Gado();
  const command = new Command();

  return client.on("presenceUpdate", async (oldMember, newMember) => {
    if (await command.checkMute("gadoPresenceListener")) {
      return;
    }

    if (newMember.user.id !== robsId) {
      return;
    }

    const gadoRole = newMember.guild.roles.cache.get(gadoId);
    const isSpam = await userLeftRecently(newMember.user.id);
    const { slappersChannel } = getChannels(newMember);

    const curDay = dayjs().day();

    if (!allowedDays.includes(curDay)) {
      await logs.saveLogs(newMember);
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

      return slappersChannel
        .send(`O gado está online 🐂🐂🐂 <@${robsId}>`)
        .catch(console.error);
    }

    if (newMember.status === "idle") {
      newMember.member.roles.add(gadoRole);
      await logs.saveLogs(newMember);

      if (isSpam) {
        return;
      }

      return slappersChannel
        .send(`<@${robsId}> foi gadar 🐂🐂🐂 `)
        .catch(console.error);
    }
  });
};
