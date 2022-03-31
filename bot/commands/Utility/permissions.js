const Discord = require("discord.js");

const cmd = require("@templates/command");

const requiredPerms = [
	"KICK_MEMBERS",
	"BAN_MEMBERS",
	"MANAGE_CHANNELS",
	"MANAGE_GUILD",
	"ADD_REACTIONS",
	"VIEW_CHANNEL",
	"SEND_MESSAGES",
	"MANAGE_MESSAGES",
	"EMBED_LINKS",
	"ATTACH_FILES",
	"READ_MESSAGE_HISTORY",
	"USE_EXTERNAL_EMOJIS",
	"CONNECT",
	"SPEAK",
	"MANAGE_NICKNAMES",
	"MANAGE_ROLES",
];

module.exports = new cmd(
	async (bot, message) => {
		const myPerms = message.channel.permissionsFor(message.guild.me);
		const perms = Object.keys(Discord.Permissions.FLAGS);

		let description = "";

		perms.forEach(perm => {
			if (requiredPerms.filter(p => p === perm).length > 0) {
				if (myPerms.has(perm)) description += `${bot.config.emojis.success} ${perm}\n`;
				else description += `${bot.config.emojis.error} ${perm}\n`;
			}
		});

		const embed = new Discord.MessageEmbed()
			.setAuthor({
				name: bot.user.tag,
				iconURL: bot.user.displayAvatarURL({ dynamic: true })
			})
			.setDescription(description)
			.setThumbnail(message.guild.iconURL({ dynamic: true, format: "png" }))
			.setFooter({
				text: `SparkV's permissions in this server. • ${bot.config.embed.footer}`,
				iconURL: bot.user.displayAvatarURL()
			})
			.setColor(bot.config.embed.color);

		await message.replyT({
			embeds: [embed],
		});
	},
	{
		description: "Displays SparkV's permissions in the current guild.",
		dirname: __dirname,
		usage: "",
		aliases: ["perms"],
		perms: [],
		slash: true,
	},
);
