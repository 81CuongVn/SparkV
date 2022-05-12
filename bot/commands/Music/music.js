const Discord = require("discord.js");

const cmd = require("@templates/musicCommand");

const Emotes = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];

async function execute(bot, message, args, command, data) {
	const state = message.options.getSubcommand();
	const embed = new Discord.MessageEmbed()
		.setAuthor({
			name: message.user.tag,
			iconURL: message.user.displayAvatarURL({ dynamic: true })
		})
		.setColor(bot.config.embed.color)
		.setTimestamp();

	if (state === "song") {
		const type = message.options.getString("action");
		let number = message.options.getNumber("number");

		if (type === "number") {
			number = parseInt(number);

			const queue = bot.distube.getQueue(message);

			if (!queue) return message.replyT(`${bot.config.emojis.error} | There is nothing in the queue right now!`);
			if (isNaN(number)) return await message.replyT(`${bot.config.emojis.error} | That's not a valid volume precentage!`);
			if (number > 100) return message.replyT(`${bot.config.emojis.error} | Due to performance reasons, songs cannot go louder than 100%.`);

			queue.setnumber(number);
			return await message.replyT({
				embeds: [embed.setDescription(`${bot.config.emojis.music} | The number is now at ${number}%.`).setColor("GREEN")]
			});
		} else if (type === "forward") {
			const queue = bot.distube.getQueue(message);

			if (!queue) return await message.replyT(`${bot.config.emojis.error} | No songs in queue.`);
			if (!queue.songs || queue.songs.length === 0) return await message.replyT(`${bot.config.emojis.error} | There are no previous songs.`);

			const number = data.options.getNumber("number");
			let forward = queue.currentTime + number;

			if (forward < 0) rewind = 0;
			if (forward >= queue.songs[0].duration) forward = queue.songs[0].duration - 1;

			await queue.seek(forward);
			return await message.replyT({
				embeds: [embed.setDescription(`${bot.config.emojis.music} | I forwarded the song by ${number} seconds ahead.`).setColor("GREEN")]
			});
		} else if (type === "rewind") {
			const queue = bot.distube.getQueue(message);

			if (!queue) return await message.replyT(`${bot.config.emojis.error} | No songs in queue.`);
			if (!queue.songs || queue.songs.length === 0) return await message.replyT(`${bot.config.emojis.error} | There are no previous songs.`);

			const number = data.options.getNumber("number");
			let rewind = queue.currentTime - number;

			if (rewind < 0) rewind = 0;
			if (rewind >= queue.songs[0].duration - queue.currentTime) rewind = 0;

			await queue.seek(rewind);
			return await message.replyT({
				embeds: [embed.setDescription(`${bot.config.emojis.music} | I rewinded the song by ${number} seconds.`).setColor("GREEN")]
			});
		}
	} else if (state === "play") {
		const query = data.options.getString("search");
		if (!query) return await message.replyT(`${bot.config.emojis.error} | Please enter a song URL or query to search!`);

		bot.distube.play(message.member.voice.channel, query, {
			textChannel: message.channel,
			member: message.member
		});

		return await message.replyT(`${bot.config.emojis.search} | Searching for **${query}**...`);
	} else if (state === "lyrics") {
		const query = data.options.getString("search");
		if (!query) return message.replyT(`${bot.config.emojis.error} | Please supply the title of a song to search for.`);

		let lyrics;
		try {
			lyrics = await (await bot.lyricsClient.songs.search(query))[0].lyrics();
		} catch (err) {
			lyrics = null;
		}

		if (!lyrics) return await message.replyT(`${bot.config.emojis.error} | I couldn't find the lyrics for **${query}**!`);

		const LyricsArray = lyrics.split(`\n`);
		const LyricsSubArray = [];
		const pages = [];

		let curLine = 0;
		let charCount = 0;
		for (const line of LyricsArray) {
			if ((charCount + line.length) < 650) {
				LyricsSubArray[curLine] = `${LyricsSubArray[curLine] + line}\n`;
				charCount += line.length;
			} else {
				curLine++;
				charCount = 0;
			}
		}

		LyricsSubArray.map((i, v) => pages.push(embed.setDescription(`**${query}**\n${i.replaceAll(undefined, "")}`).setTimestamp()));

		const msg = await message.replyT({
			embeds: [pages[0]],
			components: [
				new Discord.MessageActionRow().addComponents(
					new Discord.MessageButton()
						.setEmoji("⬅️")
						.setCustomId("quickLeft")
						.setStyle("SECONDARY"),
					new Discord.MessageButton()
						.setEmoji(bot.config.emojis.arrows.left)
						.setCustomId("left")
						.setStyle("SECONDARY"),
					new Discord.MessageButton()
						.setEmoji(bot.config.emojis.arrows.right)
						.setCustomId("right")
						.setStyle("SECONDARY"),
					new Discord.MessageButton()
						.setEmoji("➡️")
						.setCustomId("quickRight")
						.setStyle("SECONDARY")
				)
			],
			fetchReply: true
		});

		let PageNumber = 0;
		const collector = msg.createMessageComponentCollector({ time: 300 * 1000 });
		collector.on("collect", async interaction => {
			if (!interaction.deferred) interaction.deferUpdate().catch(err => { });
			if (interaction.customId === "quickLeft") PageNumber = 0;
			else if (interaction.customId === "left") PageNumber > 0 ? --PageNumber : PageNumber = (pages.length - 1);
			else if (interaction.customId === "right") PageNumber + 1 < pages.length ? ++PageNumber : PageNumber = 0;
			else if (interaction.customId === "quickRight") PageNumber = pages.length - 1;

			try {
				interaction.edit({
					embeds: [
						pages[PageNumber].setFooter({
							text: `${bot.config.embed.footer} • Page ${PageNumber + 1}/${pages.length}`
						})
					]
				});
			} catch (err) { }
		});
		collector.on("end", async interaction => {
			try {
				interaction.edit({ components: [] });
			} catch (err) { }
		});
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
		await message.replyT({
			embeds: [
				embed
					.setDescription(`${bot.config.emojis.alert} | Skipped song!\nSkiped to the next song in queue.`)
					.setColor("RED")
					.setTimestamp()
			]
		});
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
		await message.replyT({
			embeds: [
				embed
					.setDescription(`${bot.config.emojis.music} | Okay, I ${state2 === "off" ? `stopped the loop.` : `looped the ${type}.`}`)
					.setTimestamp()
					.setColor("RED")
			]
		});
	} else if (state === "manage") {
		const type = data.options.getString("action");

		if (type === "join") {
			try {
				bot.distube.voices.join(message.member.voice.channel);

				message.replyT(`${bot.config.emojis.music} | Successfully joined the voice channel.`);
			} catch (err) {
				return message.editT(`${bot.config.emojis.error} | I cannot join the voice channel! Please make sure I have the permission to join the voice channel nad that the voice channel is not full.`);
			}
		} else if (type === "leave") {
			try {
				bot.distube.voices.leave(message);

				return await message.replyT("Successfully left voice channel.");
			} catch (err) {
				return message.replyT(`${bot.config.emojis.error} | I cannot join the voice channel! Please make sure I have the permission to join the voice channel nad that the voice channel is not full.`);
			}
		} else if (type === "stop") {
			const queue = await bot.distube.getQueue(message);

			if (!queue) return message.replyT(`${bot.config.emojis.error} | There is nothing in the queue right now!`);

			queue.stop();
			await message.replyT(`${bot.config.emojis.error} | Successfully stopped the queue!`);
		} else if (type === "queue") {
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
		} else if (type === "nowplaying") {
			const queue = await bot.distube.getQueue(message);
			if (!queue) return await message.editT(`${bot.config.emojis.error} | No songs in queue!`);

			const song = queue.songs[0];
			const queueSongs = queue.songs.map((song, id) => `${Emotes[id] || (id + 1)} **${song.name}** - ${song.formattedDuration}`).slice(0, 10);

			embed
				.setTitle(`${bot.config.emojis.music} | Playing ${song.name} by ${song.uploader.name}`)
				.setImage(song.playlist?.thumbnail || song.thumbnail)
				.addField("`⏳` Duration", `\`${queue.formattedCurrentTime}/${song.formattedDuration}\``, true)
				.addField("`🔉` Number", `\`${queue.number}%\``, true)
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
				embeds: [embed],
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
						ephemeral: true
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

					const nextLoopMode = loopModes[(queue?.repeatMode ?? 0) + 1] || 0;
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
					ephemeral: true
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
		} else if (type === "previous") {
			const queue = await bot.distube.getQueue(message);

			if (!queue) return await message.replyT(`${bot.config.emojis.error} | No songs in queue.`);
			if (!queue.previousSongs || queue.previousSongs.length === 0) return await message.replyT(`${bot.config.emojis.error} | There are no previous songs.`);

			const song = queue.previous();

			await message.replyT(`${bot.config.emojis.music} | Now playing ${song.name}.`);
		} else if (type === "next") {
			const queue = await bot.distube.getQueue(message);

			if (!queue) return message.replyT(`${bot.config.emojis.error} | There is nothing in the queue right now!`);

			queue.skip();

			const embed = new Discord.MessageEmbed()
				.setAuthor({
					name: message.user.tag,
					iconURL: message.user.displayAvatarURL({ dynamic: true })
				})
				.setTitle(`${bot.config.emojis.error} | Next!`)
				.setDescription(`Going to the next song.`)
				.setTimestamp()
				.setColor("RED");

			await message.replyT({
				embeds: [embed]
			});
		} else if (type === "pause") {
			const queue = await bot.distube.getQueue(message);

			if (!queue) return await message.replyT(`${bot.config.emojis.error} | There is nothing in the queue right now! Try playing some songs.`);

			if (queue.paused) {
				queue.resume();

				return await message.replyT(`${bot.config.emojis.music} | Successfully resumed the music!`);
			}

			queue.pause();
			await message.replyT(`${bot.config.emojis.music} | Successfully paused the music!`);
		} else if (type === "resume") {
			const queue = await bot.distube.getQueue(message);

			if (!queue) return await message.replyT(`${bot.config.emojis.error} | No songs was ever/still is paused.`);

			if (queue.playing) {
				queue.pause();

				await message.replyT(`${bot.config.emojis.music} | Successfully paused the music!`);
			}

			queue.resume();
			await message.replyT(`${bot.config.emojis.music} | Successfully resumed the music. Enjoy!`);
		} else if (type === "shuffle") {
			const queue = bot.distube.getQueue(message);
			if (!queue) return message.replyT(`${bot.config.emojis.error} | There is nothing in the queue right now!`);
			if (queue.length < 2) return message.replyT(`${bot.config.emojis.error} | There is only one song in the queue!`);

			queue.shuffle();

			await message.replyT(`${bot.config.emojis.music} | Okay, I shuffled the queue.`);
		}
	}
}

module.exports = new cmd(execute, {
	description: "Play music in your Discord server!",
	dirname: __dirname,
	aliases: [],
	usage: "",
	slash: true,
	// defer: false,
	options: [
		{
			type: 1,
			name: "manage",
			description: "Manage SparkV in your VC, or the music.",
			options: [
				{
					type: 3,
					name: "action",
					description: "The action to perform.",
					required: true,
					choices: [
						{
							name: "join",
							value: "join"
						},
						{
							name: "leave",
							value: "leave"
						},
						{
							name: "stop",
							value: "stop"
						},
						{
							name: "queue",
							value: "queue"
						},
						{
							name: "nowplaying",
							value: "nowplaying"
						},
						{
							name: "previous",
							value: "previous"
						},
						{
							name: "pause",
							value: "pause"
						},
						{
							name: "resume",
							value: "resume"
						},
						{
							name: "shuffle",
							value: "shuffle"
						}
					]
				}
			]
		},
		{
			type: 1,
			name: "song",
			description: "Manage the current song for your voice channel.",
			options: [
				{
					type: 3,
					name: "action",
					description: "The action to perform.",
					required: true,
					choices: [
						{
							name: "number",
							value: "number"
						},
						{
							name: "forward",
							value: "forward"
						},
						{
							name: "remind",
							value: "remind"
						}
					]
				},
				{
					type: 10,
					name: "number",
					description: "The number for the action. (number: 1-100)",
					required: true
				}
			]
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
			name: "lyrics",
			description: "Get the lyrics to over",
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
			name: "loop",
			description: "I will loop the current song or queue.",
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
		}
	]
});
