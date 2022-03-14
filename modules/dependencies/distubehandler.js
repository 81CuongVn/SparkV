const Discord = require("discord.js");

const { DisTube } = require("distube");
const { SpotifyPlugin } = require("@distube/spotify");
const { SoundCloudPlugin } = require("@distube/soundcloud");
const { YtDlpPlugin } = require("@distube/yt-dlp");

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
		youtubeDL: false,
		ytdlOptions: {
			format: "audioonly",
			quality: "highestaudio",
			highWaterMark: 1024 * 1024 * 64,
			liveBuffer: 60 * 1000,
			dlChunkSize: 1024 * 1024 * 4,
		},
		plugins: [
			new YtDlpPlugin(),
			new SpotifyPlugin(spotifySettings),
			new SoundCloudPlugin()
		],
		youtubeCookie: process.env.YTCOOKIE
	});

	async function handleMusic(queue, song, embed) {
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

			if (!queue) return interaction.editT("There is no music playing.");

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
	}

	bot.distube
		.on("playSong", async (queue, song) => {
			const NowPlayingEmbed = new Discord.MessageEmbed()
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

			handleMusic(queue, song, NowPlayingEmbed);
		})
		.on("addSong", async (queue, song) => {
			const SongAddedQueue = new Discord.MessageEmbed()
				.setTitle(`${bot.config.emojis.music} | Added ${song.name} by ${song.uploader.name} to Queue`)
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

			handleMusic(queue, song, SongAddedQueue);
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

			handleMusic(queue, playlist, SongAddedQueue);
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

				EasyPages(message, Pages, "SearchResults", {
					footer: "⚡ - To select this song, send the current page number. For example, to select page 1 send 1.",
				});
			} catch (err) {
				bot.logger(err, "error");
			}
		})
		.on("searchDone", (message, answer, query) => { })
		.on("searchCancel", async message => await message.replyT(`Searching canceled.`))
		.on("searchInvalidAnswer", async message => await message.replyT("Search answer invalid. Make sure you're sending your selected song's page number. For example, if I wanted to play a song on the 5th page, I would send the number 5."))
		.on("searchNoResult", async message => await message.replyT("No result found!"))
		.on("finish", queue => queue.textChannel.send("No songs left in queue."))
		.on("noRelated", async message => await message.replyT("I cannot find a related video to play. I am stopping the music."))
		.on("empty", queue => queue.textChannel.send("Voice chat is empty. I'm going to leave the voice chat now."))
		.on("error", (channel, err) => {
			bot.logger(err, "error");

			channel.textChannel?.send(`❎︱Uh oh! An error occured. Please try again later. ${err}`);
		});
};
