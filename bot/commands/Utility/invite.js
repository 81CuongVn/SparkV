const Discord = require("discord.js");

const cmd = require("@templates/command");

module.exports = new cmd(
	async (bot, message) => {
		const InvitesEmbend = new Discord.MessageEmbed()
			.setTitle("Invites")
			.setDescription(`The following are links for SparkV!`)
			.setThumbnail(message?.applicationId ? message.user.displayAvatarURL({ dynamic: true, format: "gif" }) : message.author.displayAvatarURL({ dynamic: true, format: "gif" }))
			.addField("**Support Server**", `[Click Here](${bot.config.support.invite})`, true)
			.addField("**Bot Invite**", `[Click Here](${bot.config.bot_invite})`, true)
			.setFooter({
				text: `Invites for SparkV • ${bot.config.embed.footer}`,
				iconURL: bot.user.displayAvatarURL()
			})
			.setColor(bot.config.embed.color);

		await await message.replyT({
			embeds: [InvitesEmbend],
		});
	},
	{
		description: "Displays links.",
		dirname: __dirname,
		usage: "",
		aliases: ["invite", "support"],
		perms: [],
		slash: true
	},
);
