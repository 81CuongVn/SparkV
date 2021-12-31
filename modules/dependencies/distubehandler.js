const Discord = require("discord.js");
const EasyPages = require("discordeasypages");

module.exports = async bot => {
	const { DisTube, Queue } = require("distube");
	const { SpotifyPlugin } = require("@distube/spotify");
	const { SoundCloudPlugin } = require("@distube/soundcloud");

	bot.distube = new DisTube(bot, {
		searchSongs: 0,
		searchCooldown: 30,
		leaveOnFinish: true,
		leaveOnEmpty: true,
		leaveOnStop: true,
		plugins: [new SpotifyPlugin(), new SoundCloudPlugin()],
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
					.setFooter(`${song.user.tag} • (${song.playlist.songs.length} songs) - Now Playing ${song.name} • ${bot.config.embed.footer}`, song.user.displayAvatarURL());
			} else {
				NowPlayingEmbed = NowPlayingEmbed
					.setFooter(`Requested by ${song.user.tag} • ${bot.config.embed.footer}`, song.user.displayAvatarURL());
			}

			const MusicSelect = new Discord.MessageSelectMenu()
				.setCustomId("SelectMusicMenu")
				.setPlaceholder("Select a setting to toggle.")
				.addOptions([
					{
						label: "Loop",
						description: "Toggle the looping of the current song. Assessible also though the loop command.",
						value: "loop",
						emoji: "🔁"
					},
					{
						label: "AutoPlay",
						description: "Toggles autoplay for the whole server. When the song(s) end(s), SparkV will find another song simular to the song that was just played.".slice(0, 100),
						value: "autoplay",
						emoji: "🔁"
					}
				]);

			const MusicMessage = await queue.textChannel.send({
				embeds: [NowPlayingEmbed],
				components: [new Discord.MessageActionRow().addComponents(MusicSelect)],
			});

			const collector = MusicMessage.createMessageComponentCollector({ filter: interaction => interaction.customId === "SelectMusicMenu", time: 300 * 1000 });
			collector.on("collect", async interaction => {
				const queue = bot.distube.getQueue(interaction);

				if (!queue) return interaction.replyT("There is no music playing.");

				if (interaction.values[0] === "loop") {
					queue.setRepeatMode(queue.autoplay === true ? 0 : 1);

					interaction.replyT(`Looping is now ${(queue.autoplay === true ? "**DISABLED**" : "**ENABLED**")}.`);
				} else if (interaction.values[0] === "autoplay") {
					const autoplay = queue.toggleAutoplay();

					interaction.replyT(`AutoPlay is now ${(autoplay ? "**ENABLED**" : "**DISABLED**")}.`);
				}

				MusicMessage.edit({
					embeds: [NowPlayingEmbed],
					components: [new Discord.MessageActionRow().addComponents(MusicSelect)],
				});
			});

			collector.on("end", async interaction => {
				// Checks if not deleted.
				if (MusicMessage) {
					MusicMessage.update({
						embeds: [NowPlayingEmbed],
						components: []
					});
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
				.setFooter(`Requested by ${song.user.tag} • ${bot.config.embed.footer}`, song.user.displayAvatarURL())
				.setTimestamp();

			const MusicSelect = new Discord.MessageSelectMenu()
				.setCustomId("SelectMusicMenu")
				.setPlaceholder("Select a setting to toggle.")
				.addOptions([
					{
						label: "Loop",
						description: "Toggle the looping of the current song. Assessible also though the loop command.",
						value: "loop",
						emoji: "🔁"
					},
					{
						label: "AutoPlay",
						description: "Toggles autoplay for the whole server. When the song(s) end(s), SparkV will find another song simular to the song that was just played.".slice(0, 100),
						value: "autoplay",
						emoji: "🔁"
					}
				]);

			const MusicMessage = await queue.textChannel.send({
				embeds: [SongAddedQueue],
				components: [new Discord.MessageActionRow().addComponents(MusicSelect)],
			});

			const collector = MusicMessage.createMessageComponentCollector({ filter: interaction => interaction.customId === "SelectMusicMenu", time: 300 * 1000 });
			collector.on("collect", async interaction => {
				const queue = bot.distube.getQueue(interaction);

				if (!queue) return interaction.replyT("There is no music playing.");

				if (interaction.values[0] === "loop") {
					queue.setRepeatMode(queue.autoplay === true ? 0 : 1);

					interaction.replyT(`Looping is now ${(queue.autoplay === true ? "**DISABLED**" : "**ENABLED**")}.`);
				} else if (interaction.values[0] === "autoplay") {
					const autoplay = queue.toggleAutoplay();

					interaction.replyT(`AutoPlay is now ${(autoplay ? "**ENABLED**" : "**DISABLED**")}.`);
				}

				await MusicMessage.edit({
					embeds: [SongAddedQueue],
					components: [new Discord.MessageActionRow().addComponents(MusicSelect)],
				});
			});

			collector.on("end", async collected => {
				if (MusicMessage) {
					MusicMessage.update({
						embeds: [SongAddedQueue],
						components: []
					});
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
						)}\n▶︱Views: ${bot.functions.formatNumber(song.views)}\n📼︱Duration: ${song.formattedDuration
						}\`\`\``,
						inline: true,
					},

					{
						name: `🔊︱Audio Settings`,
						value: `\`\`\`🔉︱Volume: ${queue.volume}%\n🔁︱Loop: \`${queue.repeatMode ? (queue.repeatMode === 2 ? "Server Queue" : "Current Song") : "❎"
						}\n🔂︱AutoPlay: ${queue.autoplay ? "✅" : "❎"}\`\`\``,
						inline: true,
					},
				)
				.setURL(song.url)
				.setColor(bot.config.embed.color)
				.setFooter(
					`📼 ${song.user.username} (${song.user.tag}) • ${bot.config.embed.footer}`,
					bot.user.displayAvatarURL(),
				)
				.setTimestamp();

			queue.textChannel.send(SongAddedQueue);
		})
		.on("searchResult", (message, results) => {
			try {
				const Pages = [];

				const CreatePage = Song => {
					const NewEmbed = new Discord.MessageEmbed()
						.setTitle(`${Song.formattedDuration} | ${Song.name}`)
						.setColor(bot.config.embed.color)
						.setURL(Song.url)
						.setImage(Song.thumbnail);

					Pages.push(NewEmbed);
				};

				results.map(song => CreatePage(song));

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
