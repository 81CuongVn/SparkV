const Discord = require("discord.js");
const path = require("path");

const database = require("../../database/handler");

module.exports = {
	once: false,
	async execute(bot, member) {
		const data = await database.getGuild(member.guild.id);

		if (data.plugins.welcome.enabled === "false") return;

		if (member.pending === false) {
			if ((data.plugins.welcome?.roles?.length || 0) > 0) {
				const roles = data.plugins.welcome.roles.map(r => member.guild.roles.cache.get(r));

				data.plugins.welcome.roles.forEach(async r => {
					if (await member.guild.roles.fetch(r)) {
						await member.roles.add(await member.guild.roles.fetch(r));
					}
				});
			}
		}

		const channel = member.guild.channels.cache.find(ch => ch.id === data.plugins.welcome.channel);

		if (!channel) return;

		const image = await bot.functions.createCard({
			user: member.user,
			text: {
				title: "Welcome!",
				desc: "Welcome to the server!",
				footer: `You're our ${member.guild.memberCount}${member.guild.memberCount === 1 ? "st" : (member.guild.memberCount === 2 ? "nd" : (member.guild.memberCount >= 3 ? "th" : "th"))} member!`
			}
		});

		const attachment = new Discord.MessageAttachment(image.toBuffer(), `Welcome-${member.user.tag}.png`);
		const msg = data.plugins.welcome.message
			.replaceAll("{mention}", `${member}`)
			.replaceAll("{tag}", `${member.user.tag}`)
			.replaceAll("{username}", `${member.user.username}`)
			.replaceAll("{server}", `${member.guild.name}`)
			.replaceAll("{members}", `${bot.functions.formatNumber(member.guild.memberCount)}`);

		channel.send({
			content: msg,
			files: [attachment],
		}).catch(err => { });
	},
};
