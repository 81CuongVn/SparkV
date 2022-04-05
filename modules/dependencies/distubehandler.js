const Discord = require("discord.js");
const Genius = require("genius-lyrics");
const lyricsClient = new Genius.Client(process.env.GENIUS_TOKEN);

const { DisTube } = require("distube");
const { SpotifyPlugin } = require("@distube/spotify");
const { SoundCloudPlugin } = require("@distube/soundcloud");
const { YtDlpPlugin } = require("@distube/yt-dlp");

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

	bot.lyricsClient = lyricsClient;
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
		youtubeDL: false,
		plugins: [
			new YtDlpPlugin(),
			new SpotifyPlugin(spotifySettings),
			new SoundCloudPlugin()
		],
		youtubeCookie: process.env.YTCOOKIE
	});

	async function handleMusic(queue, song, mEmbed, options) {
		const TogglePlayingButton = new Discord.MessageButton()
			.setEmoji(bot.config.emojis.pause)
			.setCustomId("TP")
			.setStyle("DANGER");

		const LoopButton = new Discord.MessageButton()
			.setEmoji(bot.config.emojis.loop)
			.setCustomId("loop")
			.setStyle("SECONDARY");

		const LyricsButton = new Discord.MessageButton()
			.setEmoji(bot.config.emojis.queue)
			.setCustomId("lyrics")
			.setStyle("SECONDARY");

		const StopButton = new Discord.MessageButton()
			.setEmoji(bot.config.emojis.music_stop)
			.setCustomId("stop")
			.setStyle("DANGER");

		const buttons = [];

		if (options?.includePause === true) buttons.push(TogglePlayingButton);
		if (options?.includeStop === true) buttons.push(StopButton);
		if (options?.includeLoop === true) buttons.push(LoopButton);

		let lyrics;
		try {
			lyrics = await (await lyricsClient.songs.search(song.name))[0].lyrics();
		} catch (e) {
			lyrics = null;
		}

		if (lyrics && options?.includeLyrics === true) buttons.push(LyricsButton);

		const MusicMessage = await queue.textChannel.send({
			embeds: [mEmbed],
			components: buttons.length > 0 ? [
				{
					type: "ACTION_ROW",
					components: buttons
				}
			] : null,
			fetchReply: true
		});

		const collector = MusicMessage.createMessageComponentCollector({ time: 1800 * 1000 });
		collector.on("collect", async interaction => {
			await interaction.deferReply({
				ephemeral: true
			});

			const queue = bot.distube.getQueue(interaction);

			if (!queue) {
				await interaction.editT("There is no music playing.");

				collector.stop();
			}

			const embed = new Discord.MessageEmbed()
				.setAuthor({
					name: song.member.user.username,
					iconURL: song.member.user.displayAvatarURL({ dynamic: true })
				})
				.setFooter({
					text: bot.config.embed.footer,
					iconURL: bot.user.displayAvatarURL({ dynamic: true })
				});

			if (interaction.customId === "loop") {
				const loopModes = [
					0,
					1,
					2
				];

				const nextLoopMode = loopModes[queue.repeatMode + 1] || 0;
				const loopMode = nextLoopMode === 0 ? `${bot.config.emojis.error} Disabled` : `${bot.config.emojis.success} ${nextLoopMode === 1 ? "\`Server Queue\`" : "\`Current Song\`"}`;

				queue.setRepeatMode(nextLoopMode);

				embed
					.setTitle(`${bot.config.emojis.music} | Looping ${loopMode}`)
					.setDescription(`Looping is now ${loopMode}.`)
					.setColor(bot.config.embed.color);
			} else if (interaction.customId === "TP") {
				if (queue.paused) {
					queue.resume();

					embed
						.setTitle(`${bot.config.emojis.music} | Music Resumed!`)
						.setDescription(`Resumed ${queue.songs[0].playlist?.name || queue.songs[0].name} by ${queue.songs[0].uploader.name}.`)
						.setColor("GREEN");

					TogglePlayingButton.setEmoji(bot.config.emojis.pause).setStyle("DANGER");
				} else {
					queue.pause();

					embed
						.setTitle(`${bot.config.emojis.music} | Music Paused!`)
						.setDescription(`Paused ${queue.songs[0].playlist?.name || queue.songs[0].name} by ${queue.songs[0].uploader.name}.`)
						.setColor("RED");

					TogglePlayingButton.setEmoji(bot.config.emojis.arrows.right).setStyle("SUCCESS");
				}

				MusicMessage.editT({
					embeds: [mEmbed],
					components: [new Discord.MessageActionRow().addComponents(TogglePlayingButton, StopButton, LoopButton)]
				});
			} else if (interaction.customId === "stop") {
				queue.stop();

				embed
					.setTitle(`${bot.config.emojis.error} | Music Stopped!`)
					.setDescription(`Stopped playing ${queue.songs[0].playlist?.name || queue.songs[0].name} by ${queue.songs[0].uploader.name}.`)
					.setColor("RED");
			} else if (interaction.customId === "lyrics") {
				embed
					.setTitle(`${bot.config.emojis.queue} | Song Lyrics`)
					.setDescription(lyrics)
					.setColor(bot.config.embed.color);
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
						embeds: [mEmbed],
						components: []
					});
				} catch (e) { }
			}
		});

		return MusicMessage;
	}

	bot.distube
		.on("initQueue", queue => {
			queue.volume = 75;
		})
		.on("playSong", async (queue, song) => {
			const NowPlayingEmbed = new Discord.MessageEmbed()
				.setTitle(`${bot.config.emojis.music} | Now Playing ${song.playlist?.name || song.name}`)
				.setURL(song.url)
				.setImage(song.playlist?.thumbnail || song.thumbnail)
				.addField(`${bot.config.emojis.player} Uploader`, `\`\`\`${song.uploader?.name}\`\`\``, true)
				.addField(`${bot.config.emojis.clock} Duration`, `\`\`\`${queue.formattedCurrentTime}/${song.formattedDuration}\`\`\``, true)
				.addField(`${bot.config.emojis.clock} Song Progress`, `\`\`\`${bot.functions.splitBar(queue.currentTime, song.duration, 45)}\`\`\``)
				.addField(`${bot.config.emojis.volume} Volume`, `\`${queue.volume}%\``, true)
				.addField(`${bot.config.emojis.loop} Loop`, `${queue.repeatMode ? `${(queue.repeatMode === 2 ? "\`Server Queue\`" : "\`Current Song\`")}` : `${bot.config.emojis.error} \`Disabled\``}`, true)
				.setColor(bot.config.embed.color)
				.setTimestamp();

			if (song.playlist) {
				NowPlayingEmbed
					.setFooter({
						text: `Requested by ${song.playlist.member.user.tag} • (${song.playlist.songs.length} songs) - Now Playing ${song.name} • ${bot.config.embed.footer}`,
						iconURL: song.member.user.displayAvatarURL()
					});
			} else {
				NowPlayingEmbed
					.setFooter({
						text: `Requested by ${song.member.user.tag} • ${bot.config.embed.footer}`,
						iconURL: song.member.user.displayAvatarURL()
					});
			}

			const message = await handleMusic(queue, song, NowPlayingEmbed, {
				includePause: true,
				includeStop: true,
				includeLoop: true,
				includeLyrics: true
			});

			const updateMusic = setInterval(async () => {
				if (queue.playing === false && queue.paused === false) return clearInterval(updateMusic);

				if (queue.paused === false) {
					NowPlayingEmbed.fields = [
						{
							name: `${bot.config.emojis.player} Uploader`,
							value: `\`\`\`${song.uploader?.name}\`\`\``,
							inline: true
						},
						{
							name: `${bot.config.emojis.clock} Duration`,
							value: `\`\`\`${queue.formattedCurrentTime}/${song.formattedDuration}\`\`\``,
							inline: true,
						},
						{
							name: `${bot.config.emojis.clock} Song Progress`,
							value: `\`\`\`${bot.functions.splitBar(queue.currentTime, song.duration, 45)}\`\`\``,
							inline: false
						},
						{
							name: `${bot.config.emojis.volume} Volume`,
							value: `\`${queue.volume}%\``,
							inline: true
						},
						{
							name: `${bot.config.emojis.loop} Loop`,
							value: `${queue.repeatMode ? `${bot.config.emojis.success} ${(queue.repeatMode === 2 ? "\`Server Queue\`" : "\`Current Song\`")}` : `${bot.config.emojis.error} \`Disabled\``}`,
							inline: true
						}
					];

					try {
						await message.edit({
							embeds: [NowPlayingEmbed]
						});
					} catch (e) {
						clearInterval(updateMusic);
					}
				}
			}, 7.5 * 1000);
		})
		.on("addSong", async (queue, song) => {
			const SongAddedQueue = new Discord.MessageEmbed()
				.setTitle(`${bot.config.emojis.music} | Added ${song.name} to Queue`)
				.setURL(song.url)
				.setImage(song.playlist?.thumbnail || song.thumbnail)
				.addField(`${bot.config.emojis.player} Uploader`, `\`\`\`${song.uploader?.name}\`\`\``, true)
				.addField(`${bot.config.emojis.clock} Duration`, `\`\`\`${song.formattedDuration}\`\`\``, true)
				.addField(`${bot.config.emojis.volume} Volume`, `\`${queue.volume}%\``, true)
				.addField(`${bot.config.emojis.loop} Loop`, `${queue.repeatMode ? `${(queue.repeatMode === 2 ? "\`Server Queue\`" : "\`Current Song\`")}` : `${bot.config.emojis.error} \`Disabled\``}`, true)
				.setColor(bot.config.embed.color)
				.setTimestamp();

			const message = await handleMusic(queue, song, SongAddedQueue, {
				includeLoop: false,
				includePause: false,
				includeStop: false,
				includeLyrics: false
			});

			const updateMusic = setInterval(async () => {
				if (queue.playing === false && queue.paused === false) return clearInterval(updateMusic);

				if (queue.paused === false) {
					SongAddedQueue.fields = [
						{
							name: `${bot.config.emojis.player} Uploader`,
							value: `\`\`\`${song.uploader?.name}\`\`\``,
							inline: true
						},
						{
							name: `${bot.config.emojis.clock} Duration`,
							value: `\`\`\`${song.formattedDuration}\`\`\``,
							inline: true,
						},
						{
							name: `${bot.config.emojis.volume} Volume`,
							value: `\`${queue.volume}%\``,
							inline: true
						},
						{
							name: `${bot.config.emojis.loop} Loop`,
							value: `${queue.repeatMode ? `${bot.config.emojis.success} ${(queue.repeatMode === 2 ? "\`Server Queue\`" : "\`Current Song\`")}` : `${bot.config.emojis.error} \`Disabled\``}`,
							inline: true
						}
					];

					try {
						await message.edit({
							embeds: [SongAddedQueue]
						});
					} catch (e) {
						clearInterval(updateMusic);
					}
				}
			}, 7.5 * 1000);
		})
		.on("addList", async (queue, playlist) => {
			const SongAddedQueue = new Discord.MessageEmbed()
				.setTitle(`${bot.config.emojis.music} | Added ${playlist.name} (Playlist) To Queue`)
				.setDescription(playlist.name)
				.setImage(playlist?.thumbnail)
				.addField("`⏳` Duration", `\`${playlist.formattedDuration}\``, true)
				.addField("`🔉` Volume", `\`${queue.volume}%\``, true)
				.addField("`🔁` Loop", `\`${queue.repeatMode ? (queue.repeatMode === 2 ? "🔁 | Server Queue" : "🔂 | Current Song") : "`❎`"}\``, true)
				.addField("`🔁` AutoPlay", `\`${queue.autoplay ? "`✅`" : "`❎`"}\``, true)
				.setURL(playlist?.url)
				.setColor(bot.config.embed.color)
				.setFooter({
					text: `Requested by ${playlist.member.user.tag}`,
					iconURL: playlist.member.user.displayAvatarURL()
				})
				.setTimestamp();

			handleMusic(queue, playlist, SongAddedQueue, {
				includePause: false,
				includeStop: false,
				includeLoop: false,
				includeLyrics: false
			});
		})
		.on("searchDone", (message, answer, query) => { })
		.on("searchCancel", async message => await message.replyT(`Searching canceled.`))
		.on("searchInvalidAnswer", async message => await message.replyT("Search answer invalid. Make sure you're sending your selected song's page number. For example, if I wanted to play a song on the 5th page, I would send the number 5."))
		.on("searchNoResult", async message => await message.replyT("No result found!"))
		.on("finish", queue => queue.textChannel.send("No songs left in queue."))
		.on("noRelated", async message => await message.replyT("I cannot find a related video to play. I am stopping the music."))
		.on("empty", queue => queue.textChannel.send("Voice chat is empty. I'm going to leave the voice chat now."))
		.on("error", (channel, err) => channel.textChannel?.send(`${bot.config.emojis.error}︱Uh oh! An error occured. ${err}`));
};
