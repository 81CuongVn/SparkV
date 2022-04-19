const Discord = require("discord.js");
const path = require("path");

const database = require("../../database/handler");

module.exports = {
	once: false,
	async execute(bot, member) {
		const data = await database.getGuild(member.guild.id);

		if (data.plugins.goodbye.enabled === "false") return;

		const channel = channel?.guild?.channels?.cache.get(data.plugins?.goodbye?.channel) || await channel?.guild?.channels?.fetch(data.plugins?.goodbye?.channel);

		if (!channel) return;

		const image = await bot.functions.createCard({
			user: member.user,
			text: {
				title: "Goodbye!",
				desc: "We hope to see you again soon!",
				footer: `You're our ${member.guild.memberCount}${member.guild.memberCount === 1 ? "st" : (member.guild.memberCount === 2 ? "nd" : (member.guild.memberCount >= 3 ? "th" : "th"))} member!`
			}
		});

		const attachment = new Discord.MessageAttachment(image.toBuffer(), `Goodbye-${member.user.tag}.png`);
		const msg = data.plugins.goodbye.message
			.replaceAll("{mention}", `${member}`)
			.replaceAll("{tag}", `${member.user.tag}`)
			.replaceAll("{username}", `${member.user.username}`)
			.replaceAll("{server}", `${member.guild.name}`)
			.replaceAll("{members}", `${bot.functions.formatNumber(member.guild.memberCount)}`);

		channel.send({
			content: msg,
			files: [attachment],
		}).catch(err => {});
	},
};
