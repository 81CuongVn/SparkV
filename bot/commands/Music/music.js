const Discord = require("discord.js");

const cmd = require("@templates/musicCommand");

const Emotes = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];

async function execute(bot, message, args, command, data) {
	const state = message.options.getSubcommand();

	if (state === "join") {
		try {
			bot.distube.voices.join(message.member.voice.channel);

			return await message.replyT(`${bot.config.emojis.music} | Successfully joined voice channel.`);
		} catch (err) {
			return message.replyT(`${bot.config.emojis.error} | I cannot join the voice channel! Please make sure I have the permission to join the voice channel nad that the voice channel is not full.`);
		}
	} else if (state === "leave") {
		try {
			bot.distube.voices.leave(message);

			return await message.replyT("Successfully left voice channel.");
		} catch (err) {
			return message.replyT(`${bot.config.emojis.error} | I cannot join the voice channel! Please make sure I have the permission to join the voice channel nad that the voice channel is not full.`);
		}
	} else if (state === "play") {
		const query = message?.applicationId ? data.options.get("search").value : args.join(" ");

		if (!query) return await message.replyT(`${bot.config.emojis.error} | Please enter a song URL or query to search!`);

		bot.distube.play(message.member.voice.channel, query, {
			textChannel: message.channel,
			member: message.member,
		});

		return await message.replyT(`${bot.config.emojis.search} | Searching for **${query}**...`);
	} else if (state === "stop") {
		const queue = await bot.distube.getQueue(message);

		if (!queue) return message.replyT(`${bot.config.emojis.error} | There is nothing in the queue right now!`);

		queue.stop();
		await message.replyT(`${bot.config.emojis.error} | Successfully stopped the queue!`);
	} else if (state === "skip") {
		const queue = await bot.distube.getQueue(message);

		if (!queue) return message.replyT(`${bot.config.emojis.error} | There is nothing in the queue right now!`);

		const number = data.options.getNumber("number");
		if (number) {
			try {
				bot.distube.jump(message, number);

				return await message.replyT(`${bot.config.emojis.music} | I successfully jumped to song #${number} in queue!`);
			} catch (err) {
				return await message.replyT(`${bot.config.emojis.error} | Invalid song number!`);
			}
		}

		queue.skip();

		const embed = new Discord.MessageEmbed()
			.setAuthor({
				name: message.user.tag,
				iconURL: message.user.displayAvatarURL({ dynamic: true })
			})
			.setTitle(`${bot.config.emojis.error} | Skipped!`)
			.setDescription(`Skiped to the next song.`)
			.setFooter(bot.config.embed.footer)
			.setColor("RED");

		await message.replyT({
			embeds: [embed]
		});
	} else if (state === "previous") {
		const queue = await bot.distube.getQueue(message);

		if (!queue) return await message.replyT(`${bot.config.emojis.error} | No songs in queue.`);
		if (!queue.previousSongs || queue.previousSongs.length === 0) return await message.replyT(`${bot.config.emojis.error} | There are no previous songs.`);

		const song = queue.previous();

		await message.replyT(`${bot.config.emojis.music} | Now playing ${song.name}.`);
	} else if (state === "pause") {
		const queue = await bot.distube.getQueue(message);

		if (!queue) return await message.replyT(`${bot.config.emojis.error} | There is nothing in the queue right now! Try playing some songs.`);

		if (queue.paused) {
			queue.resume();

			return await message.replyT(`${bot.config.emojis.music} | Successfully resumed the music!`);
		}

		queue.pause();
		await message.replyT(`${bot.config.emojis.music} | Successfully paused the music!`);
	} else if (state === "resume") {
		const queue = await bot.distube.getQueue(message);

		if (!queue) return await message.replyT(`${bot.config.emojis.error} | No songs was ever/still is paused.`);

		if (queue.playing) {
			queue.pause();

			await message.replyT(`${bot.config.emojis.music} | Successfully paused the music!`);
		}

		queue.resume();
		await message.replyT(`${bot.config.emojis.music} | Successfully resumed the music. Enjoy!`);
	} else if (state === "queue") {
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
	} else if (state === "nowplaying") {
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
	} else if (state === "rewind") {
		const queue = bot.distube.getQueue(message);

		if (!queue) return await message.replyT(`${bot.config.emojis.error} | No songs in queue.`);
		if (!queue.songs || queue.songs.length === 0) return await message.replyT(`${bot.config.emojis.error} | There are no previous songs.`);

		const number = data.options.getNumber("number");
		let rewind = queue.currentTime - number;

		if (rewind < 0) rewind = 0;
		if (rewind >= queue.songs[0].duration - queue.currentTime) rewind = 0;

		await queue.seek(rewind);
		return message.replyT(`${bot.config.emojis.music} | I rewinded the song by ${number} seconds.`);
	} else if (state === "forward") {
		const queue = bot.distube.getQueue(message);

		if (!queue) return await message.replyT(`${bot.config.emojis.error} | No songs in queue.`);
		if (!queue.songs || queue.songs.length === 0) return await message.replyT(`${bot.config.emojis.error} | There are no previous songs.`);

		const number = data.options.getNumber("number");
		let forward = queue.currentTime + number;

		if (forward < 0) rewind = 0;
		if (forward >= queue.songs[0].duration) forward = queue.songs[0].duration - 1;

		await queue.seek(forward);
		return message.replyT(`${bot.config.emojis.music} | I forwarded the song by ${number} seconds ahead.`);
	} else if (state === "loop") {
		const Queue = bot.distube.getQueue(message);

		if (!Queue) return await message.replyT(`${bot.config.emojis.error} | There is no music playing in this guild.`);

		const state2 = data.options.getString("state");
		const type = data.options.getString("type");
		let mode;

		if (state2 === "on") {
			if (type === `song`) mode = 1;
			else if (type === `queue`) mode = 2;
		} else if (state2 === "off") {
			mode = 0;
		}

		Queue.setRepeatMode(mode);

		await message.replyT(`${bot.config.emojis.music} | Okay, I ${state2 === "off" ? `stopped the loop.` : `looped the ${type}.`}`);
	} else if (state === "shuffle") {
		const queue = bot.distube.getQueue(message);
		if (!queue) return message.replyT(`${bot.config.emojis.error} | There is nothing in the queue right now!`);
		if (queue.length < 2) return message.replyT(`${bot.config.emojis.error} | There is only one song in the queue!`);

		queue.shuffle();

		await message.replyT(`${bot.config.emojis.music} | Okay, I shuffled the queue.`);
	} else if (state === "volume") {
		let volume = data.options.getString("volume");
		volume = parseInt(volume);

		const queue = bot.distube.getQueue(message);

		if (!queue) return message.replyT(`${bot.config.emojis.error} | There is nothing in the queue right now!`);
		if (isNaN(volume)) return await message.replyT(`${bot.config.emojis.error} | That's not a valid number!`);
		if (parseInt(volume) > 100) return message.replyT(`${bot.config.emojis.error} | Due to performance reasons, songs cannot go louder than 100%.`);

		queue.setVolume(volume);
		return await message.replyT(`${bot.config.emojis.music} | I successfully set the volume to ${volume}%!`);
	}
}

module.exports = new cmd(execute, {
	description: "Play music in your server!",
	dirname: __dirname,
	aliases: [],
	usage: "",
	options: [
		{
			type: 1,
			name: "join",
			description: "I will join your voice channel."
		},
		{
			type: 1,
			name: "leave",
			description: "I will leave your voice channel."
		},
		{
			type: 1,
			name: "play",
			description: "I will look for a song name or URL to play in your voice channel.",
			options: [
				{
					type: 3,
					name: "search",
					description: "The song URL or song title.",
					required: true
				}
			]
		},
		{
			type: 1,
			name: "stop",
			description: "I will stop playing music and leave the voice chat."
		},
		{
			type: 1,
			name: "skip",
			description: "I will skip the current song and play the next song in the queue.",
			options: [
				{
					type: 10,
					name: "number",
					description: "The song number to skip to. Leave this blank to skip to the next song."
				}
			]
		},
		{
			type: 1,
			name: "previous",
			description: "I will go back to the previous song."
		},
		{
			type: 1,
			name: "pause",
			description: "I will pause the current song.",
		},
		{
			type: 1,
			name: "resume",
			description: "I will resume the current song.",
		},
		{
			type: 1,
			name: "queue",
			description: "I will leave your voice channel."
		},
		{
			type: 1,
			name: "nowplaying",
			description: "I will display the currenly playing song."
		},
		{
			type: 1,
			name: "forward",
			description: "I will forward x seconds.",
			options: [
				{
					type: 10,
					name: "number",
					description: "The amount of seconds to forward the song.",
					required: true
				}
			]
		},
		{
			type: 1,
			name: "remind",
			description: "I will remind x seconds.",
			options: [
				{
					type: 10,
					name: "number",
					description: "The amount of seconds to rewind the song.",
					required: true
				}
			]
		},
		{
			type: 1,
			name: "loop",
			description: "I will loop the current song.",
			options: [
				{
					type: 3,
					name: "state",
					description: "Whether to repeat or not.",
					required: true,
					choices: [
						{
							name: "on",
							value: "on"
						},
						{
							name: "off",
							value: "off"
						}
					]
				},
				{
					type: 3,
					name: "type",
					description: "The repeating type. Song will repeat the song. Queue will repeat the queue.",
					required: true,
					choices: [
						{
							name: "song",
							value: "song"
						},
						{
							name: "queue",
							value: "queue"
						}
					]
				}
			]
		},
		{
			type: 1,
			name: "volume",
			description: "I will set the volume of the currently playong track.",
			options: [
				{
					type: 3,
					name: "volume",
					description: "A number from 1-100 that controls the song's volume.",
					required: true
				}
			]
		},
		{
			type: 1,
			name: "shuffle",
			description: "I will shuffle the queue."
		}
	],
	slash: true
});
