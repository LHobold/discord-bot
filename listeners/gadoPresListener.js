import { users, channels, roles } from "../data/serverIds.js";

// Ids
const { earlId, robsId, pauloId, thiagoId } = users;
const { slappersId, botModId, secretChannelId } = channels;
const { gadoId } = roles;

export default (client, allowedDays) => {
  return client.on("presenceUpdate", (oldMember, newMember) => {
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
      slappersChannel
        .send(`<@${robsId}> foi gadar 🐂🐂🐂 `)
        .catch(console.error);

      const gadoRole = newMember.guild.roles.cache.get(gadoId);
      newMember.member.roles.add(gadoRole);
    }
  });
};
