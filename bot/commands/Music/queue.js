const Discord = require(`discord.js`);

const cmd = require("../../templates/musicCommand");

async function execute(bot, message, args, command, data) {
	const queue = bot.distube.getQueue(message);

	if (!queue) return await message.replyT(`${bot.config.emojis.error} | The queue is empty! Try adding some songs.`);

	const queueEmbed = new Discord.MessageEmbed()
		.setTitle(`${bot.config.emojis.music} | Queue for ${message.guild.name}`)
		.setDescription(queue.songs.map((song, id) => `**${id + 1}**. ${song.name} - ${song.formattedDuration}`).slice(0, 10).join(`\n`))
		.setColor(bot.config.embed.color)
		.setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
		.setFooter({
			text: `${bot.config.emojis.music} | Displaying music queue.`,
			iconURL: bot.user.displayAvatarURL({ dynamic: true })
		});

	return await message.replyT({
		embeds: [queueEmbed]
	});
}

module.exports = new cmd(execute, {
	description: `Shows the songs in queue.`,
	dirname: __dirname,
	usage: "<number>",
	aliases: ["que"],
	perms: ["EMBED_LINKS"],
	slash: true
});
