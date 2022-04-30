const Discord = require("discord.js");
const canvacord = require("canvacord");

const cmd = require("@templates/command");

async function execute(bot, message, args, command, data) {
	const state = data.options.getSubcommand();

	const embed = new Discord.MessageEmbed()
		.setColor(bot.config.embed.color)
		.setFooter({
			text: bot.config.embed.footer,
			iconURL: bot.user.displayAvatarURL({ dynamic: true, format: "png" })
		});

	if (state === "user") {
		const User = data.options.getMember("user") || message.user;
		const avatar = User.displayAvatarURL({ dynamic: true, format: "png" });

		const pngType = avatar.replace(".gif", ".png");
		const jpgType = avatar.replace(".png", ".jpg").replace(".gif", ".jpg");
		const gifType = avatar.replace(".png", ".gif");

		embed
			.setAuthor({
				name: `${User.user ? User.user.tag : User.tag}'s Avatar`,
				iconURL: User.user
					? User.user.displayAvatarURL({ dynamic: true, format: "png" })
					: User.displayAvatarURL({ dynamic: true, format: "png" }),
			})
			.setDescription(`[32px](${avatar}?size=32) | [64px](${avatar}?size=64) | [128px](${avatar}?size=128) | [256px](${avatar}?size=256) | [512px](${avatar}?size=512) | [1024px](${avatar}?size=1024)\n[png](${pngType}) | [jpg](${jpgType}) | [gif](${gifType})`)
			.setThumbnail(`${avatar}?size=512`);
	} else if (state === "server") {
		const guildIcon = message.guild.iconURL({ dynamic: true, format: "png" });

		const pngType = guildIcon.replace(".gif", ".png");
		const jpgType = guildIcon.replace(".png", ".jpg").replace(".gif", ".jpg");
		const gifType = guildIcon.replace(".png", ".gif");

		embed
			.setAuthor({
				name: `${message.guild.name}'s ${await message.translate("Server Icon")}`,
				iconURL: guildIcon
			})
			.setDescription(`[32px](${guildIcon}?size=32) | [64px](${guildIcon}?size=64) | [128px](${guildIcon}?size=128) | [256px](${guildIcon}?size=256) | [512px](${guildIcon}?size=512) | [1024px](${guildIcon}?size=1024)\n[png](${pngType}) | [jpg](${jpgType}) | [gif](${gifType})`)
			.setThumbnail(`${guildIcon}?size=512`);
	}

	await message.replyT({
		embeds: [embed],
	});
}

module.exports = new cmd(execute, {
	description: "Grab the icon of the server or a user.",
	dirname: __dirname,
	aliases: [],
	usage: "(type (user/server)) (user/invite)",
	slash: true,
	options: [
		{
			type: 1,
			name: "user",
			description: "Grab a user's icon.",
			options: [
				{
					type: 6,
					name: "user",
					description: "User of who you want to get the avatar of. Default: Your own avatar."
				}
			]
		},
		{
			type: 1,
			name: "server",
			description: "Grab a server's icon.",
			options: [
				{
					type: 3,
					name: "invite",
					description: "The Invite for the server you want to get the server icon of. Default: current server."
				}
			]
		}
	]
});
