const Discord = require("discord.js");
const canvacord = require("canvacord");

const cmd = require("../../templates/command");

async function execute(bot, message, args, command, data) {
	const guildIcon = message.guild.iconURL({ dynamic: true, format: "png" });

	const pngType = guildIcon.replace(".gif", ".png");
	const jpgType = guildIcon.replace(".png", ".jpg").replace(".gif", ".jpg");
	const gifType = guildIcon.replace(".png", ".gif");

	const avatarEmbed = new Discord.MessageEmbed()
		.setAuthor({
			name: `${message.guild.name}'s Server Icon`,
			iconURL: guildIcon
		})
		.addField("**Sizes**", `[32px](${guildIcon}?size=32)\n[64px](${guildIcon}?size=64)\n[128px](${guildIcon}?size=128)\n[256px](${guildIcon}?size=256)\n[512px](${guildIcon}?size=512)\n[1024px](${guildIcon}?size=1024)`, true)
		.addField("**File Types**", `[png](${pngType})\n[jpg](${jpgType})\n[gif](${gifType})`, true)
		.setImage(`${guildIcon}?size=512`)
		.setColor(bot.config.embed.color)
		.setFooter({
			text: bot.config.embed.footer,
			iconURL: bot.user.displayAvatarURL({ dynamic: true })
		});

	await message.replyT({
		embeds: [avatarEmbed],
	});
}

module.exports = new cmd(execute, {
	description: "Gets the current server's server icon in all sizes and file types!",
	dirname: __dirname,
	aliases: ["si"],
	usage: ``,
	slash: true,
});
