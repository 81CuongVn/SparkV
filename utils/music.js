const Discord = require("discord.js");
const Genius = require("genius-lyrics");
const lyricsClient = new Genius.Client(process.env.GENIUS_TOKEN);

const { Manager } = require("erela.js");
const Spotify = require("erela.js-spotify");
const AppleMusic = require("erela.js-apple");
const Deezer = require("erela.js-deezer");
const TIDAL = require("erela.js-tidal");

module.exports = async bot => {
	bot.lyricsClient = lyricsClient;

	let nodes = [
		{
			host: "lavalink.kingch1ll.repl.co",
			port: 443,
			password: process.env.LAVALINK_PASSWORD,
			secure: true
		},
		{
			host: "lavalink2.kingch1ll.repl.co",
			port: 443,
			password: process.env.LAVALINK_PASSWORD,
			secure: true
		},
		{
			host: "node1.kartadharta.xyz",
			port: 443,
			password: "kdlavalink",
			secure: true
		},
		{
			host: "www.exlink.ml",
			port: 443,
			password: "exlava",
			secure: true
		},
		{
			host: "www.lavalinknodepublic.ml",
			port: 443,
			password: "mrextinctcodes",
			secure: true
		},
		{
			host: "lavalink.oops.wtf",
			port: 2000,
			password: "www.freelavalink.ga",
			secure: false
		},
		{
			host: "lavalink.gaproknetwork.xyz",
			port: 2333,
			password: "gaproklavalink",
			secure: false
		},
		{
			host: "lavalink.darrenofficial.com",
			port: 80,
			password: "lavalink",
			secure: false
		},
		{
			host: "lavalink.islantay.tk",
			port: 8880,
			password: "waifufufufu",
			secure: false
		},
		{
			host: "weez-node.cf",
			port: 2333,
			password: "FreeLava",
			secure: false
		},
		{
			host: "dislavalink.gq",
			port: 2333,
			password: "gemzandmj",
			secure: false
		},
		{
			host: "usa.lavalink.mitask.tech",
			port: 2333,
			password: "lvs",
			secure: false
		},
		{
			host: "lavalink.kapes.eu",
			port: 2222,
			password: "lavalinkplay",
			secure: false
		},
		{
			host: "181.214.231.105",
			port: 6665,
			password: "syslink",
			secure: false
		},
		{
			host: "lv.vellerius.tk",
			port: 2333,
			password: "derpilava",
			secure: false
		},
		{
			host: "lavalink.cloudblue.ml",
			port: 1555,
			password: "danbotbest",
			secure: false
		},
		{
			host: "lavalink.rukchadisa.live",
			port: 8080,
			password: "youshallnotpass",
			secure: false
		}
	];
	if (process.argv.includes("--dev") === true) {
		nodes = [];
		nodes.push({
			host: "lavalink3.kingch1ll.repl.co",
			port: 443,
			password: process.env.LAVALINK_PASSWORD,
			secure: true
		});
	}

	bot.music = new Manager({
		nodes,
		plugins: [
			new Spotify({
				clientID: process.env.SPOTIFYID,
				clientSecret: process.env.SPOTIFYSECRET
			}),
			new TIDAL(),
			new Deezer(),
			new AppleMusic()
		],
		send(id, payload) {
			const guild = bot.guilds.cache.get(id);
			guild && guild.shard.send(payload);
		}
	}).on("nodeConnect", node => bot.logger(`[Music System] Node ${node.options.identifier} connected`))
		.on("nodeError", (node, error) => console.log(`[Music System] Error: Node ${node.options.identifier} had an error: ${error.message}`, "error"))
		.on("trackStart", async (player, track) => {
			const playerData = bot.music.players.get(player.guild);
			const NowPlayingEmbed = new Discord.MessageEmbed()
				.setTitle(`${bot.config.emojis.music} | Now Playing ${track.title}`)
				.setURL(track.uri)
				.setThumbnail(track.displayThumbnail())
				.addField(`${bot.config.emojis.player} Uploader`, `\`\`\`${track?.author}\`\`\``, true)
				.addField(`${bot.config.emojis.clock} Duration`, `\`\`\`00:00/${bot.music.formatDuration(track?.duration)}\`\`\``, true)
				.addField(`${bot.config.emojis.clock} Song Progress`, `\`\`\`${bot.functions.splitBar(0, track.duration, 45)}\`\`\``, false)
				.addField(`${bot.config.emojis.volume} Volume`, `\`${playerData?.volume}%\``, true)
				.addField(`${bot.config.emojis.loop} Loop`, `${playerData.trackRepeat ? `${bot.config.emojis.success} \`Enabled: Song\`` : playerData.queueRepeat ? `${bot.config.emojis.success} \`Enabled: Queue\`` : `${bot.config.emojis.error} \`Disabled\``}`, true)
				.setFooter({
					text: `Requested by ${player.get("requester")?.tag} • ${bot.config.embed.footer}`,
					iconURL: player.requester?.displayAvatarURL()
				})
				.setColor(bot.config.embed.color)
				.setTimestamp();

			const { msg } = await bot.music.handleMusic(playerData, track, NowPlayingEmbed, {
				includePause: true,
				includeStop: true,
				includeLoop: true,
				includeLyrics: true,
				createCollector: true
			});
			player.set("message", msg);

			const updateMusic = setInterval(async () => {
				if (player?.queue?.playing === false && player?.queue?.paused === false) return clearInterval(updateMusic);
				if (player?.queue?.paused === true) return;
				NowPlayingEmbed.fields = [
					{
						name: `${bot.config.emojis.player} Uploader`,
						value: `\`\`\`${track?.author}\`\`\``,
						inline: true
					},
					{
						name: `${bot.config.emojis.clock} Duration`,
						value: `\`\`\`${bot.music.formatDuration(player?.position)}/${bot.music.formatDuration(track?.duration)}\`\`\``,
						inline: true
					},
					{
						name: `${bot.config.emojis.clock} Song Progress`,
						value: `\`\`\`${bot.functions.splitBar(player?.position, track.duration, 45)}\`\`\``,
						inline: false
					},
					{
						name: `${bot.config.emojis.volume} Volume`,
						value: `\`${player.volume}%\``,
						inline: true
					},
					{
						name: `${bot.config.emojis.loop} Loop`,
						value: `${playerData.trackRepeat ? `${bot.config.emojis.success} \`Enabled: Song\`` : playerData.queueRepeat ? `${bot.config.emojis.success} \`Enabled: Queue\`` : `${bot.config.emojis.error} \`Disabled\``}`,
						inline: true
					}
				];

				try {
					await msg.edit({
						embeds: [NowPlayingEmbed]
					});
				} catch (e) {
					clearInterval(updateMusic);
				}
			}, 7.5 * 1000);
		})
		.on("trackStuck", async (player, track) => {
			const guild = bot.guilds.cache.get(player.guild);
			const channel = guild.channels.cache.get(player.textChannel) || await guild.channels.fetch(player.textChannel).catch(err => { });

			channel && await channel.send({
				embeds: [
					new Discord.MessageEmbed()
						.setDescription(`${bot.config.emojis.alert} | **Error Occured**\nAn error occurred while playing the song.`)
						.setColor("RED")
				]
			});
		})
		.on("queueEnd", async player => {
			const guild = bot.guilds.cache.get(player.guild);
			const channel = guild.channels.cache.get(player.textChannel) || await guild.channels.fetch(player.textChannel);

			await channel.send({
				embeds: [
					new Discord.MessageEmbed()
						.setDescription(`${bot.config.emojis.alert} | **Queue Ended**\nAdd more songs to keep playing more music.`)
						.setColor("RED")
				]
			});
			player.destroy();
		})
		.on("socketClosed", (player, payload) => payload.byRemote === true && player.destroy());

	bot.music.formatDuration = duration => {
		let seconds = parseInt((duration / 1000) % 60);
		let minutes = parseInt((duration / (1000 * 60)) % 60);
		let hours = parseInt((duration / (1000 * 60 * 60)) % 24);

		hours = (hours < 10) ? `0${hours}` : hours;
		minutes = (minutes < 10) ? `0${minutes}` : minutes;
		seconds = (seconds < 10) ? `0${seconds}` : seconds;

		return duration < (3600 * 1000) ? `${minutes}:${seconds}` : `${hours}:${minutes}:${seconds}`;
	};
	bot.music.handleMusic = async (playerData, track, mEmbed, options) => {
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
			lyrics = await (await lyricsClient.songs.search(track.title))[0].lyrics();
		} catch (e) {
			lyrics = null;
		}

		if (lyrics && options?.includeLyrics === true) buttons.push(LyricsButton);

		const guild = bot.guilds.cache.get(playerData.guild);
		const channel = guild.channels.cache.get(playerData.textChannel) || await guild.channels.fetch(playerData.textChannel);
		const MusicMessage = await channel.send({
			embeds: [mEmbed],
			components: buttons.length > 0 ? [
				{
					type: "ACTION_ROW",
					components: buttons
				}
			] : null,
			fetchReply: true
		}).catch(err => { });

		if (!MusicMessage) return;

		let collector;
		if (options?.createCollector === true) {
			collector = MusicMessage.createMessageComponentCollector({ time: 1800 * 1000 });
			collector.on("collect", async interaction => {
				await interaction.deferReply({
					ephemeral: true
				});

				const embed = new Discord.MessageEmbed()
					.setAuthor({
						name: interaction.user.tag,
						iconURL: interaction.user.displayAvatarURL({ dynamic: true })
					})
					.setTimestamp();

				if (interaction.customId === "loop") {
					const playerData = bot.music.players.get(interaction?.guild?.id);
					if (!playerData) {
						await interaction.editT("There is no music playing.");
						collector.stop();
					}

					const loopModes = [0, 1, 2];
					const nextLoopMode = loopModes[queue.repeatMode + 1] || 0;
					const loopMode = nextLoopMode === 0 ? `${bot.config.emojis.error} Disabled` : `${bot.config.emojis.success} ${nextLoopMode === 1 ? "\`Server Queue\`" : "\`Current Song\`"}`;

					queue.setRepeatMode(nextLoopMode).catch(err => { });

					embed
						.setTitle(`${bot.config.emojis.music} | Looping ${loopMode}`)
						.setDescription(`Looping is now ${loopMode}.`)
						.setColor(bot.config.embed.color);
				} else if (interaction.customId === "TP") {
					const playerData = bot.music.players.get(interaction?.guild?.id);
					if (!playerData) {
						await interaction.editT("There is no music playing.");
						collector.stop();
					}

					if (playerData?.paused === true) {
						playerData?.pause(false);

						embed
							.setTitle(`${bot.config.emojis.music} | Music Resumed!`)
							.setDescription(`Resumed ${playerData?.queue?.current?.title} by ${playerData?.queue?.current?.author}.`)
							.setColor("GREEN");

						TogglePlayingButton.setEmoji(bot.config.emojis.pause).setStyle("DANGER");
					} else {
						playerData?.pause(true);

						embed
							.setTitle(`${bot.config.emojis.music} | Music Paused!`)
							.setDescription(`Paused ${playerData?.queue?.current?.title} by ${playerData?.queue?.current?.author}.`)
							.setColor("RED");

						TogglePlayingButton.setEmoji(bot.config.emojis.arrows.right).setStyle("SUCCESS");
					}

					MusicMessage.editT({
						embeds: [mEmbed],
						components: [new Discord.MessageActionRow().addComponents(TogglePlayingButton, StopButton, LoopButton)]
					});
				} else if (interaction.customId === "stop") {
					const playerData = bot.music.players.get(interaction?.guild?.id);
					if (!playerData) {
						await interaction.editT("There is no music playing.");
						collector.stop();
					}

					playerData?.stop();

					embed
						.setTitle(`${bot.config.emojis.error} | Music Stopped!`)
						.setDescription(`Stopped playing ${playerData?.queue?.current?.title} by ${playerData?.queue?.current?.author}.`)
						.setColor("RED");
				} else if (interaction.customId === "lyrics") {
					embed
						.setTitle(`${bot.config.emojis.queue} | Song Lyrics`)
						.setDescription(lyrics.length >= 4000 ? `${lyrics.slice(0, 2000)}...\nView more lyrics by typing /lyrics.` : lyrics)
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
		}

		return { msg: MusicMessage, collector };
	};
};
