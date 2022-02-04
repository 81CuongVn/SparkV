const Discord = require("discord.js");
const { DisTube } = require("distube");
const { SpotifyPlugin } = require("@distube/spotify");
const { SoundCloudPlugin } = require("@distube/soundcloud");
const EasyPages = require("discordeasypages");

module.exports = async bot => {
	const spotifySettings = {
		parallel: true,
		emitEventsAfterFetching: true,
	};

	if (process.env.SPOTIFYID && process.env.SPOTIFYSECRET) {
		spotifySettings.api = {
			clientId: process.env.SPOTIFYID,
			clientSecret: process.env.SPOTIFYSECRET,
		};
	}

	bot.distube = new DisTube(bot, {
		searchSongs: 0,
		searchCooldown: 30,
		leaveOnFinish: true,
		leaveOnEmpty: true,
		leaveOnStop: true,
		emitNewSongOnly: true,
		savePreviousSongs: true,
		emitAddSongWhenCreatingQueue: false,
		emptyCooldown: 25,
		ytdlOptions: {
			format: "audioonly",
			quality: "highestaudio",
			highWaterMark: 1024 * 1024 * 64,
			liveBuffer: 60 * 1000,
			dlChunkSize: 1024 * 1024 * 4,
		},
		plugins: [
			new SpotifyPlugin(spotifySettings),
			new SoundCloudPlugin()
		],
		youtubeDL: true,
		updateYouTubeDL: true,
		youtubeCookie: process.env.YTCOOKIE
	});

	bot.distube
		.on("playSong", async (queue, song) => {
			let NowPlayingEmbed = new Discord.MessageEmbed()
				.setTitle(`${bot.config.emojis.music} | Now Playing ${song.playlist?.name || song.name} by ${song.uploader.name}`)
				.setURL(song.url)
				.setImage(song.playlist?.thumbnail || song.thumbnail)
				.addField("`⏳` Duration", `\`${song.formattedDuration}\``, true)
				.addField("`🔉` Volume", `\`${queue.volume}%\``, true)
				.addField("`🔁` Loop", `\`${queue.repeatMode ? (queue.repeatMode === 2 ? "Server Queue" : "Current Song") : "`❎`"}\``, true)
				.addField("`🔂` AutoPlay", `\`${queue.autoplay ? "`✅`" : "`❎`"}\``, true)
				.setColor(bot.config.embed.color)
				.setTimestamp();

			if (song.playlist) {
				NowPlayingEmbed = NowPlayingEmbed
					.setFooter({
						text: `${song.user.tag} • (${song.playlist.songs.length} songs) - Now Playing ${song.name} • ${bot.config.embed.footer}`,
						iconURL: song.user.displayAvatarURL()
					});
			} else {
				NowPlayingEmbed = NowPlayingEmbed
					.setFooter({
						text: `Requested by ${song.user.tag} • ${bot.config.embed.footer}`,
						iconURL: song.user.displayAvatarURL()
					});
			}

			const LoopButton = new Discord.MessageButton()
				.setEmoji("🔁")
				.setCustomId("loop")
				.setStyle("PRIMARY");

			const TogglePlayingButton = new Discord.MessageButton()
				.setEmoji("⏯")
				.setCustomId("TP")
				.setStyle("PRIMARY");

			const StopButton = new Discord.MessageButton()
				.setEmoji("⏹️")
				.setCustomId("stop")
				.setStyle("DANGER");

			const MusicMessage = await queue.textChannel.send({
				embeds: [NowPlayingEmbed],
				components: [
					new Discord.MessageActionRow().addComponents(TogglePlayingButton, LoopButton, StopButton)
				],
				fetchReply: true
			});

			const collector = MusicMessage.createMessageComponentCollector({ time: 300 * 1000 });
			collector.on("collect", async interaction => {
				await interaction.deferReply();

				const queue = bot.distube.getQueue(interaction);

				if (!queue) return interaction.replyT("There is no music playing.");

				const embed = new Discord.MessageEmbed()
					.setAuthor({
						name: song.user.username,
						iconURL: song.user.displayAvatarURL({ dynamic: true })
					})
					.setFooter(bot.config.embed.footer);

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
							.setDescription(`Resumed ${song.playlist?.name || song.name} by ${song.uploader.name}.`)
							.setColor("GREEN");
					} else {
						queue.pause();

						embed
							.setTitle(`${bot.config.emojis.music} | Music Paused!`)
							.setDescription(`Paused ${song.playlist?.name || song.name} by ${song.uploader.name}.`)
							.setColor("RED");
					}
				} else if (interaction.customId === "stop") {
					queue.stop();

					embed
						.setTitle(`${bot.config.emojis.error} | Music Stopped!`)
						.setDescription(`Stopped playing ${song.playlist?.name || song.name} by ${song.uploader.name}.`)
						.setColor("RED");
				}

				interaction.replyT({
					embeds: [embed],
				});
			});

			collector.on("end", async interaction => {
				// Checks if not deleted.
				if (MusicMessage) {
					try {
						MusicMessage?.update({
							embeds: [NowPlayingEmbed],
							components: []
						});
					} catch (e) { }
				}
			});
		})
		.on("addSong", async (queue, song) => {
			const SongAddedQueue = new Discord.MessageEmbed()
				.setTitle(`${bot.config.emojis.music} | Added ${song.name} by ${song.uploader.name} To Queue`)
				.setImage(song.playlist?.thumbnail || song.thumbnail)
				.addField("`⏳` Duration", `\`${song.formattedDuration}\``, true)
				.addField("`🔉` Volume", `\`${queue.volume}%\``, true)
				.addField("`🔁` Loop", `\`${queue.repeatMode ? (queue.repeatMode === 2 ? "🔁 | Server Queue" : "🔂 | Current Song") : "`❎`"}\``, true)
				.addField("`🔁` AutoPlay", `\`${queue.autoplay ? "`✅`" : "`❎`"}\``, true)
				.setURL(song.url)
				.setColor(bot.config.embed.color)
				.setFooter({
					text: `Requested by ${song.user.tag} • ${bot.config.embed.footer}`,
					iconURL: song.user.displayAvatarURL()
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

			const MusicMessage = await queue.textChannel.send({
				embeds: [SongAddedQueue],
				components: [new Discord.MessageActionRow().addComponents(TogglePlayingButton, LoopButton, StopButton)],
				fetchReply: true
			});

			const collector = MusicMessage.createMessageComponentCollector({ time: 300 * 1000 });
			collector.on("collect", async interaction => {
				await interaction.deferReply();

				const queue = bot.distube.getQueue(interaction);

				if (!queue) return interaction.replyT("There is no music playing.");

				const embed = new Discord.MessageEmbed()
					.setAuthor({
						name: song.user.username,
						iconURL: song.user.displayAvatarURL({ dynamic: true })
					})
					.setFooter(bot.config.embed.footer);

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
							.setDescription(`Resumed ${song.playlist?.name || song.name} by ${song.uploader.name}.`)
							.setColor("GREEN");
					} else {
						queue.pause();

						embed
							.setTitle(`${bot.config.emojis.music} | Music Paused!`)
							.setDescription(`Paused ${song.playlist?.name || song.name} by ${song.uploader.name}.`)
							.setColor("RED");
					}
				} else if (interaction.customId === "stop") {
					queue.stop();

					embed
						.setTitle(`${bot.config.emojis.error} | Music Stopped!`)
						.setDescription(`Stopped playing ${song.playlist?.name || song.name} by ${song.uploader.name}.`)
						.setColor("RED");
				}

				interaction.replyT({
					embeds: [embed],
				});
			});

			collector.on("end", async collected => {
				if (MusicMessage) {
					try {
						MusicMessage?.update({
							embeds: [SongAddedQueue],
							components: []
						});
					} catch (e) { }
				}
			});
		})
		.on("addList", async (queue, playlist) => {
			const SongAddedQueue = new Discord.MessageEmbed()
				.setTitle(`${bot.config.emojis.music} | Added Playlist To Queue`)
				.setDescription(playlist.name)
				.setImage(playlist.thumbnail)
				.addFields(
					{
						name: `⚙︱Audio Stats`,
						value: `\`\`\`👍︱Likes: ${bot.functions.formatNumber(
							song.likes,
						)}\n👎︱Dislikes: ${bot.functions.formatNumber(
							song.dislikes,
						)}\n▶︱Views: ${bot.functions.formatNumber(song.views)}\n📼︱Duration: ${song.formattedDuration}\`\`\``,
						inline: true,
					},

					{
						name: `🔊︱Audio Settings`,
						value: `\`\`\`🔉︱Volume: ${queue.volume}%\n🔁︱Loop: \`${queue.repeatMode ? (queue.repeatMode === 2 ? "Server Queue" : "Current Song") : "❎"}\n🔂︱AutoPlay: ${queue.autoplay ? "✅" : "❎"}\`\`\``,
						inline: true,
					},
				)
				.setURL(song.url)
				.setColor(bot.config.embed.color)
				.setFooter({
					text: `📼 ${song.user.username} (${song.user.tag}) • ${bot.config.embed.footer}`,
					iconURL: bot.user.displayAvatarURL(),
				})
				.setTimestamp();

			queue.textChannel.send(SongAddedQueue);
		})
		.on("searchResult", (message, results) => {
			try {
				const Pages = [];

				results.map(Song => {
					const NewEmbed = new Discord.MessageEmbed()
						.setTitle(`${Song.formattedDuration} | ${Song.name}`)
						.setColor(bot.config.embed.color)
						.setURL(Song.url)
						.setImage(Song.thumbnail);

					Pages.push(NewEmbed);
				});

				EasyPages(
					message,
					Pages,
					["⬅", "➡"],
					"⚡ - To select this song, send the current page number. For example, to select page 1 send 1.",
				);
			} catch (err) {
				console.error(err);
			}
		})
		.on("searchDone", (message, answer, query) => { })
		.on("searchCancel", async message => await message.replyT(`Searching canceled.`))
		.on("searchInvalidAnswer", async message =>
			await message.replyT(
				"Search answer invalid. Make sure you're sending your selected song's page number. For example, if I wanted to play a song on the 5th page, I would send the number 5.",
			),
		)
		.on("searchNoResult", async message => await message.replyT("No result found!"))
		.on("finish", queue => queue.textChannel.send("No songs left in queue."))
		.on("noRelated", async message =>
			await message.replyT("I cannot find a related video to play. I am stopping the music."),
		)
		.on("empty", queue => queue.textChannel.send("Voice chat is empty. I'm going to leave the voice chat now."))
		.on("disconnect", queue => queue.textChannel.send("Disconnected from voice chat."))
		.on("error", (channel, err) => {
			console.error(err);

			channel.textChannel?.send(`❎︱Uh oh! An error occured. Please try again later. ${err}`);
		});
};
