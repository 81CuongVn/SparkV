const os = require("os");
const Discord = require("discord.js");

const cmd = require("../../templates/command");

module.exports = new cmd(
	async (bot, message, args) => {
		const user = message.mentions.members.first() || message.author;
		const member = message.channel.guild.members.cache.get(user.id);

		const InfoEmbed = new Discord.MessageEmbed()
			.setAuthor({
				name: user.user ? user.user.tag : user.tag,
				iconURL: user.user
					? user.user.displayAvatarURL({ dynamic: true, format: "png" })
					: user.displayAvatarURL({ dynamic: true, format: "png" }),
			})
			.addFields(
				{
					name: "**Account Info**",
					value: `Joined: <t:${~~(member.joinedAt / 1000)}:R>\nRegistered: <t:${~~(user.createdAt / 1000)}:R>`,
					inline: true,
				},
				{
					name: "**Profile Links**",
					value: `Avatar URL: [Click Here](${
						user.user
							? user.user.displayAvatarURL({ dynamic: true, format: "png" })
							: user.displayAvatarURL({ dynamic: true, format: "png" })
					})`,
					inline: true,
				},
			)
			.setFooter(bot.config.embed.footer, bot.user.displayAvatarURL({ dynamic: true, format: "png" }))
			.setColor(bot.config.embed.color);

		await message.replyT({
			embeds: [InfoEmbed],
		});
	},
	{
		description: "See information about a user.",
		dirname: __dirname,
		usage: "<user>",
		aliases: ["ui"],
		perms: ["EMBED_LINKS"],
	},
);
