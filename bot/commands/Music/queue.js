const Discord = require(`discord.js`);

const cmd = require("../../templates/musicCommand");

const Emotes = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];

async function execute(bot, message, args, command, data) {
	const queue = bot.distube.getQueue(message);

	if (!queue) return await message.replyT(`${bot.config.emojis.error} | The queue is empty! Try adding some songs.`);

	const queueSongs = queue.songs.map((song, id) => `${Emotes[id] || (id + 1)} **${song.name}** - ${song.formattedDuration}`).slice(0, 10);
	const queueEmbed = new Discord.MessageEmbed()
		.setAuthor({
			name: message.user.tag,
			iconURL: message.user.displayAvatarURL({ dynamic: true })
		})
		.setTitle(`${bot.config.emojis.music} | ${message.guild.name}'s Music Queue`)
		.setDescription(queueSongs.join("\n"))
		.setColor(bot.config.embed.color)
		.setThumbnail(message.guild.iconURL({ dynamic: true }))
		.setFooter({
			text: `${message.guild.name}'s Music Queue`,
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
	slash: true,
	slashOnly: true
});
