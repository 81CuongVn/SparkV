const Discord = require(`discord.js`);

const cmd = require("../../templates/musicCommand");

async function execute(bot, message, args, command, data) {
	const queue = await bot.distube.getQueue(message);

	if (!queue) return message.replyT(`${bot.config.emojis.error} | There is nothing in the queue right now!`);

	queue.skip();

	const embed = new Discord.MessageEmbed()
		.setAuthor({
			name: User.user ? User.user.tag : User.tag,
			iconURL: User.user ? User.user.displayAvatarURL({ dynamic: true }) : User.displayAvatarURL({ dynamic: true })
		})
		.setTitle(`${bot.config.emojis.error} | Skipped!`)
		.setDescription(`Skiped to the next song.`)
		.setFooter(bot.config.embed.footer)
		.setColor("RED");

	await message.replyT({
		embeds: [embed]
	});
}

module.exports = new cmd(execute, {
	description: `Skip to the next song in the queue.`,
	usage: "",
	aliases: ["nextsong", "nsong", "nexts", "next"],
	perms: ["EMBED_LINKS"],
	slash: true
});
