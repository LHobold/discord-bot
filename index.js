const Discord = require('discord.js');
const upperName = require('./utils/upperName').default;

require('dotenv').config({ path: '.env' });

// Users
const robsId = '232157423081619457';
const earlId = '232189605414305795';

// Channels
const slappersId = '869363826540281916';

// Roles
const gadoId = '898985262770688111';

// Others
const allowedDays = [0, 6];
////////////////////////////////////////////////////

const client = new Discord.Client({
	intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_PRESENCES'],
});
client.login(process.env.BOT_TOKEN);

/////////////////////// LISTENERS /////////////////

client.on('ready', () => {
	client.user.setActivity('mato pro boi');
	console.log('Ready');
});

client.on('message', async msg => {
	const curDay = new Date().getDay();

	const msgContent = msg.content.toLowerCase();
	const toCheck = ['qual', 'som', 'gado'];
	const toCheckGado = ['quem', 'gado'];

	if (toCheckGado.every(s => msgContent.includes(s))) {
		return msg.reply('É o robs 🐂🐂🐂');
	}

	if (toCheck.every(s => msgContent.includes(s))) {
		return msg.reply('Vamo joga um CS rapaziada');
	}

	if (!allowedDays.includes(curDay)) {
		return;
	}

	if ((msg.channelId = slappersId && msg.author.id === robsId)) {
		const slappersChannel = msg.guild.channels.cache.get(slappersId);
		slappersChannel.send(`Gado de mais`).catch(console.error);
	}
});

client.on('message', msg => {
	const msgContent = msg.content.toLowerCase();
	if (msgContent.trim().startsWith('!b:')) {
		let champName = msgContent.split(':')[1].trim();

		if (champName.includes("'")) {
			const nameArr = champName.split("'");
			champName = upperName(nameArr[0]) + upperName(nameArr[1]);
		} else {
			champName = upperName(champName);
		}

		const link = `https://www.lolvvv.com/pt/champion/${champName}/probuilds`;

		const slappersChannel = msg.guild.channels.cache.get(slappersId);
		slappersChannel.send(link).catch(console.error);
	}
});

client.on('presenceUpdate', (oldMember, newMember) => {
	const curDay = new Date().getDay();

	if (!allowedDays.includes(curDay)) {
		return;
	}

	if (newMember.status === 'online' && newMember.userId === earlId) {
		const slappersChannel = newMember.guild.channels.cache.get(slappersId);
		// slappersChannel.send(`Vermes`).catch(console.error);
	}

	if (newMember.status === 'online' && newMember.userId === robsId) {
		const slappersChannel = newMember.guild.channels.cache.get(slappersId);
		slappersChannel
			.send(`O gado está online 🐂🐂🐂 <@${robsId}>`)
			.catch(console.error);

		const gadoRole = newMember.guild.roles.cache.get(gadoId);
		newMember.member.roles.remove(gadoRole);
	}

	if (newMember.status === 'idle' && newMember.userId === robsId) {
		const slappersChannel = newMember.guild.channels.cache.get(slappersId);
		slappersChannel.send(`<@${robsId}> foi gadar 🐂🐂🐂 `).catch(console.error);

		const gadoRole = newMember.guild.roles.cache.get(gadoId);
		newMember.member.roles.add(gadoRole);
	}
});
