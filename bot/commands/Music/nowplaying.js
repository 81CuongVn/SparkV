const Discord = require(`discord.js`);

const cmd = require("@templates/musicCommand");

const Emotes = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];

async function execute(bot, message, args, command, data) {
	const queue = await bot.distube.getQueue(message);

	if (!queue) return await message.editT(`${bot.config.emojis.error} | No songs in queue!`);

	const song = queue.songs[0];
	const queueSongs = queue.songs.map((song, id) => `${Emotes[id] || (id + 1)} **${song.name}** - ${song.formattedDuration}`).slice(0, 10);
	const SongAddedQueue = new Discord.MessageEmbed()
		.setTitle(`${bot.config.emojis.music} | Playing ${song.name} by ${song.uploader.name} To Queue`)
		.setImage(song.playlist?.thumbnail || song.thumbnail)
		.addField("`⏳` Duration", `\`${queue.formattedCurrentTime}/${song.formattedDuration}\``, true)
		.addField("`🔉` Volume", `\`${queue.volume}%\``, true)
		.addField("`🔁` Loop", `\`${queue.repeatMode ? (queue.repeatMode === 2 ? "🔁 | Server Queue" : "🔂 | Current Song") : "`❎`"}\``, true)
		.addField("`🔁` AutoPlay", `\`${queue.autoplay ? "`✅`" : "`❎`"}\``, true)
		.addField(`\`🎵\` Songs [${queue.songs.length}]`, `\`${queueSongs.join("\n")}\``, false)
		.setURL(song.url)
		.setColor(bot.config.embed.color)
		.setFooter({
			text: `Requested by ${song.member.user.tag} • ${bot.config.embed.footer}`,
			iconURL: song.member.user.displayAvatarURL()
		})
		.setTimestamp();

	const TogglePlayingButton = new Discord.MessageButton()
		.setEmoji("⏯")
		.setCustomId("TP")
		.setStyle("PRIMARY");

	const LoopButton = new Discord.MessageButton()
		.setEmoji("🔁")
		.setCustomId("loop")
		.setStyle("PRIMARY");

	const StopButton = new Discord.MessageButton()
		.setEmoji("⏹️")
		.setCustomId("stop")
		.setStyle("DANGER");

	const MusicMessage = await message.editT({
		embeds: [SongAddedQueue],
		components: [new Discord.MessageActionRow().addComponents(TogglePlayingButton, StopButton, LoopButton)],
		fetchReply: true
	});

	const collector = MusicMessage.createMessageComponentCollector({ time: 1800 * 1000 });
	collector.on("collect", async interaction => {
		await interaction.deferReply({
			ephemeral: true
		});

		const queue = bot.distube.getQueue(interaction);

		if (!queue) {
			return interaction.replyT({
				content: "There is no music playing.",
				ephemeral: true,
			});
		}

		const embed = new Discord.MessageEmbed()
			.setAuthor({
				name: song.user.username,
				iconURL: song.user.displayAvatarURL({ dynamic: true })
			})
			.setFooter({
				text: bot.config.embed.footer,
				iconURL: bot.user.displayAvatarURL()
			});

		if (interaction.customId === "loop") {
			const loopModes = [
				0,
				1,
				2
			];

			const nextLoopMode = loopModes[queue.repeatMode + 1] || 0;
			const loopMode = nextLoopMode === 0 ? "**DISABLED**" : (nextLoopMode === 1 ? "**ENABLED FOR SONG**" : "**ENABLED FOR SERVER QUEUE**");

			queue.setRepeatMode(nextLoopMode);

			embed
				.setTitle(`${bot.config.emojis.music} | Looping ${loopMode}`)
				.setDescription(`Looping is now ${loopMode}`)
				.setColor(bot.config.embed.color);
		} else if (interaction.customId === "TP") {
			if (queue.paused) {
				queue.resume();

				embed
					.setTitle(`${bot.config.emojis.music} | Music Resumed!`)
					.setDescription(`Resumed ${queue.songs[0].playlist?.name || queue.songs[0].name} by ${queue.songs[0].uploader.name}.`)
					.setColor("GREEN");
			} else {
				queue.pause();

				embed
					.setTitle(`${bot.config.emojis.music} | Music Paused!`)
					.setDescription(`Paused ${queue.songs[0].playlist?.name || queue.songs[0].name} by ${queue.songs[0].uploader.name}.`)
					.setColor("RED");
			}
		} else if (interaction.customId === "stop") {
			queue.stop();

			embed
				.setTitle(`${bot.config.emojis.error} | Music Stopped!`)
				.setDescription(`Stopped playing ${queue.songs[0].playlist?.name || queue.songs[0].name} by ${queue.songs[0].uploader.name}.`)
				.setColor("RED");
		}

		interaction.replyT({
			embeds: [embed],
			ephemeral: true,
		});
	});

	collector.on("end", async collected => {
		if (MusicMessage) {
			try {
				MusicMessage?.edit({
					embeds: [SongAddedQueue],
					components: []
				});
			} catch (e) { }
		}
	});
}

module.exports = new cmd(execute, {
	description: `I will display the currently playing song.`,
	dirname: __dirname,
	usage: "",
	aliases: ["np"],
	perms: [],
	slash: true,
	ephemeral: true
});
