const os = require("os");
const Discord = require("discord.js");

const cmd = require("../../templates/command");

module.exports = new cmd(
	async (bot, message, args, command, data) => {
		let user = message?.applicationId ? data.options.getMember("user") || message.user : (await bot.functions.fetchUser(args[0]) || message.author);
		const member = message.channel.guild.members.cache.get(user.id);

		user = user.user ? await user.user.fetch() : await user.fetch();

		const InfoEmbed = new Discord.MessageEmbed()
			.setAuthor({
				name: user.user ? user.user.tag : user.tag,
				iconURL: user.user
					? user.user.displayAvatarURL({ dynamic: true })
					: user.displayAvatarURL({ dynamic: true }),
			})
			.setThumbnail(user.user ? user.user.displayAvatarURL({ dynamic: true }) : user.displayAvatarURL({ dynamic: true }))
			.addField("**JOINED**", `<t:${~~(member.joinedAt / 1000)}:R>`, true)
			.addField("**REGISTERED**", `<t:${~~(user.createdAt / 1000)}:R>`, true)
			.addField("**AVATAR**", `[Click for Avatar](${user.user ? user.user.displayAvatarURL({ dynamic: true }) : user.displayAvatarURL({ dynamic: true })})`, true)
			.setFooter({
				text: `ID: ${user.user ? user.user.id : user.id} • ${bot.config.embed.footer}`,
				iconURL: bot.user.displayAvatarURL({ dynamic: true })
			})
			.setColor(bot.config.embed.color);

		if (user.user ? user.user.bannerURL({ dynamic: true }) : user.bannerURL({ dynamic: true })) {
			InfoEmbed
				.setImage(user.user ? user.user.bannerURL({ dynamic: true, size: 1024 }) : user.bannerURL({ dynamic: true, size: 1024 }))
				.addField("**BANNER**", `[Click for Banner](${user.user ? user.user.displayAvatarURL({ dynamic: true }) : user.displayAvatarURL({ dynamic: true })})`, true);
		}

		await message.replyT({
			embeds: [InfoEmbed],
		});
	},
	{
		description: "See information about a user.",
		dirname: __dirname,
		usage: "(user)",
		aliases: ["ui"],
		perms: ["EMBED_LINKS"],
		slash: true,
		options: [
			{
				type: 6,
				name: "user",
				description: "The user to get the information of.",
			}
		]
	},
);
