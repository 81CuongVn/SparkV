const Discord = require("discord.js");
const canvacord = require("canvacord");

const cmd = require("../../templates/command");

async function execute(bot, message, args) {
	const User = await bot.functions.fetchUser(args[0]) || message.author;
	const avatar = User.displayAvatarURL({ dynamic: true, format: "png" });

	const pngType = avatar.replace(".gif", ".png");
	const jpgType = avatar.replace(".png", ".jpg").replace(".gif", ".jpg");
	const gifType = avatar.replace(".png", ".gif");

	if (message.content.includes("-url")) await message.replyT(`URL: <${avatar}>`);

	const avatarEmbed = new Discord.MessageEmbed()
		.setAuthor({
			name: `${User.user ? User.user.tag : User.tag}'s Avatar`,
			iconURL: User.user
				? User.user.displayAvatarURL({ dynamic: true, format: "png" })
				: User.displayAvatarURL({ dynamic: true, format: "png" }),
		})
		.addField("**Sizes**", `[32px](${avatar}?size=32)\n[64px](${avatar}?size=64)\n[128px](${avatar}?size=128)\n[256px](${avatar}?size=256)\n[512px](${avatar}?size=512)\n[1024px](${avatar}?size=1024)`, true)
		.addField("**File Types**", `[png](${pngType})\n[jpg](${jpgType})\n[gif](${gifType})`, true)
		.setImage(`${avatar}?size=512`)
		.setColor(bot.config.embed.color)
		.setFooter({
			text: bot.config.embed.footer,
			iconURL: bot.user.displayAvatarURL({ dynamic: true, format: "png" })
		});

	await message.replyT({
		embeds: [avatarEmbed],
	});
}

module.exports = new cmd(execute, {
	description: "4K avatar 512x512",
	dirname: __dirname,
	aliases: [],
	usage: `(@member) (optional: -url)`,
	slash: true
});
