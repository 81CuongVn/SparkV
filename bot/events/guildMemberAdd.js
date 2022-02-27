const Discord = require("discord.js");
const Canvas = require("discord-canvas");
const path = require("path");

const database = require("../../database/handler");

module.exports = {
	once: false,
	async execute(bot, member) {
		const data = await database.getGuild(member.guild.id);

		if (data.plugins.welcome.enabled === "false") return;

		if ((data.plugins.welcome?.roles?.length || 0) > 0) {
			const roles = data.plugins.welcome.roles.map(r => member.guild.roles.cache.get(r));

			data.plugins.welcome.roles.forEach(async r => {
				if (await member.guild.roles.fetch(r)) {
					await member.roles.add(await member.guild.roles.fetch(r));
				}
			});
		}

		const channel = member.guild.channels.cache.find(ch => ch.id === data.plugins.welcome.channel);

		if (!channel) return;

		const image = await new Canvas.Welcome()
			.setUsername(member.user.username)
			.setDiscriminator(member.user.discriminator)
			.setMemberCount(member.guild.memberCount)
			.setGuildName(member.guild.name)
			.setAvatar(member.user.displayAvatarURL({ dynamic: true, format: "png" }))
			.setColor("border", "#5f9afa")
			.setColor("username-box", "#5f9afa")
			.setColor("discriminator-box", "#5f9afa")
			.setColor("message-box", "#5f9afa")
			.setColor("title", "#5f9afa")
			.setColor("avatar", "#5f9afa")
			.toAttachment();

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
		}).catch(err => {});
	},
};
