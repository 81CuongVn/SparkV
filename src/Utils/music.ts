import Discord, { ButtonStyle, Colors } from "discord.js";
import { Client } from "genius-lyrics";

import { Manager } from "erela.js";
import Spotify from "erela.js-spotify";

export default (bot: any) => {
	if (process.env?.GENIUS_TOKEN) bot.lyricsClient = new Client(process.env.GENIUS_TOKEN);

	bot.music = new Manager({
		nodes: [{
			host: "lavalink.kingch1ll.repl.co",
			port: 443,
			password: process.env.LAVALINK_PASSWORD,
			secure: true
		}, {
			host: "lavalink2.kingch1ll.repl.co",
			port: 443,
			password: process.env.LAVALINK_PASSWORD,
			secure: true
		}, {
			host: "node1.kartadharta.xyz",
			port: 443,
			password: "kdlavalink",
			secure: true
		}, {
			host: "www.exlink.ml",
			port: 443,
			password: "exlava",
			secure: true
		}, {
			host: "www.lavalinknodepublic.ml",
			port: 443,
			password: "mrextinctcodes",
			secure: true
		}, {
			host: "lavalink.oops.wtf",
			port: 2000,
			password: "www.freelavalink.ga",
			secure: false
		}, {
			host: "lavalink.gaproknetwork.xyz",
			port: 2333,
			password: "gaproklavalink",
			secure: false
		}, {
			host: "lavalink.darrenofficial.com",
			port: 80,
			password: "lavalink",
			secure: false
		}, {
			host: "weez-node.cf",
			port: 2333,
			password: "FreeLava",
			secure: false
		}, {
			host: "dislavalink.gq",
			port: 2333,
			password: "gemzandmj",
			secure: false
		}, {
			host: "usa.lavalink.mitask.tech",
			port: 2333,
			password: "lvs",
			secure: false
		}, {
			host: "lavalink.kapes.eu",
			port: 2222,
			password: "lavalinkplay",
			secure: false
		}, {
			host: "lv.vellerius.tk",
			port: 2333,
			password: "derpilava",
			secure: false
		}, {
			host: "lavalink.cloudblue.ml",
			port: 1555,
			password: "danbotbest",
			secure: false
		}, {
			host: "lavalink.rukchadisa.live",
			port: 8080,
			password: "youshallnotpass",
			secure: false
		}],
		plugins: [
			new Spotify({
				clientID: process.env.SPOTIFYID,
				clientSecret: process.env.SPOTIFYSECRET
			} as {
				clientID: string,
				clientSecret: string
			}),
		],
		send(id, payload) {
			const guild = bot.guilds.cache.get(id);
			guild && guild.shard.send(payload);
		}
	}).on("nodeConnect", node => bot.logger(`[Music System] Node ${node.options.identifier} connected`))
		.on("nodeError", (node, error) => console.log(`[Music System] Error: Node ${node.options.identifier} had an error: ${error.message}`, "error"))
		.on("trackStart", async (player: any, track: any) => {
			const playerData: any = bot.music.players.get(player.guild);
			const requester: any = player.get("requester");
			const NowPlayingEmbed: any = new Discord.EmbedBuilder()
				.setTitle(`${bot.config.emojis.music} | Now Playing ${track.title}`)
				.setURL(track.uri)
				.setThumbnail(track.displayThumbnail())
				.addFields([
					{
						name: `${bot.config.emojis.player} Uploader`,
						value: `\`\`\`${track?.author}\`\`\``,
						inline: true
					}, {
						name: `${bot.config.emojis.clock} Duration`,
						value: `\`\`\`00:00/${bot.music.formatDuration(track?.duration)}\`\`\``,
						inline: true
					}, {
						name: `${bot.config.emojis.clock} Song Progress`,
						value: `\`\`\`${bot.functions.splitBar(0, track.duration, 45)}\`\`\``,
						inline: false
					}, {
						name: `${bot.config.emojis.volume} Volume`,
						value: `\`${playerData?.volume}%\``,
						inline: true
					}, {
						name: `${bot.config.emojis.loop} Loop`,
						value: `${playerData.trackRepeat ? `${bot.config.emojis.success} \`Enabled: Song\`` : playerData.queueRepeat ? `${bot.config.emojis.success} \`Enabled: Queue\`` : `${bot.config.emojis.error} \`Disabled\``}`,
						inline: true
					}
				])
				.setFooter({
					text: `Requested by ${requester?.tag} • ${bot.config.embed.footer}`,
					iconURL: requester?.displayAvatarURL()
				})
				.setColor(Colors.Blue)
				.setTimestamp();

			const { msg } = await bot.music.handleMusic(playerData, track, NowPlayingEmbed, {
				includePause: true,
				includeStop: true,
				includeLoop: true,
				includeLyrics: true,
				createCollector: true
			});
			player.set("message", msg);

			const updateMusic: any = setInterval(async () => {
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
			const channel = guild.channels.cache.get(player.textChannel) || await guild.channels.fetch(player.textChannel).catch((): any => { });

			channel && await channel.send({
				embeds: [
					new Discord.EmbedBuilder()
						.setDescription(`${bot.config.emojis.alert} | **Error Occured**\nAn error occurred while playing the song.`)
						.setColor(Colors.Red)
				]
			});
		})
		.on("queueEnd", async player => {
			const guild = bot.guilds.cache.get(player.guild);
			const channel = guild.channels.cache.get(player.textChannel) || await guild.channels.fetch(player.textChannel);

			await channel.send({
				embeds: [
					new Discord.EmbedBuilder()
						.setDescription(`${bot.config.emojis.alert} | **Queue Ended**\nAdd more songs to keep playing more music.`)
						.setColor(Colors.Red)
				]
			});
			player.destroy();
		})
		.on("socketClosed", (player, payload) => payload.byRemote === true && player.destroy());

	bot.music.formatDuration = (duration: number) => {
		let seconds: any = (duration / 1000) % 60;
		let minutes: any = (duration / (1000 * 60)) % 60;
		let hours: any = (duration / (1000 * 60 * 60)) % 24;

		hours = (hours < 10) ? `0${hours}` : hours;
		minutes = (minutes < 10) ? `0${minutes}` : minutes;
		seconds = (seconds < 10) ? `0${seconds}` : seconds;

		return duration < (3600 * 1000) ? `${minutes}:${seconds}` : `${hours}:${minutes}:${seconds}`;
	};
	bot.music.handleMusic = async (playerData: any, track: any, mEmbed: Discord.EmbedBuilder, options: any) => {
		const TogglePlayingButton = new Discord.ButtonBuilder()
			.setEmoji(bot.config.emojis.pause)
			.setCustomId("TP")
			.setStyle(ButtonStyle.Danger);

		const LoopButton = new Discord.ButtonBuilder()
			.setEmoji(bot.config.emojis.loop)
			.setCustomId("loop")
			.setStyle(ButtonStyle.Secondary);

		const LyricsButton = new Discord.ButtonBuilder()
			.setEmoji(bot.config.emojis.queue)
			.setCustomId("lyrics")
			.setStyle(ButtonStyle.Secondary);

		const StopButton = new Discord.ButtonBuilder()
			.setEmoji(bot.config.emojis.music_stop)
			.setCustomId("stop")
			.setStyle(ButtonStyle.Danger);

		const buttons = [];

		if (options?.includePause === true) buttons.push(TogglePlayingButton);
		if (options?.includeStop === true) buttons.push(StopButton);
		if (options?.includeLoop === true) buttons.push(LoopButton);

		let lyrics: any;
		try { lyrics = await (await bot.lyricsClient.songs.search(track.title))[0].lyrics(); } catch (e) { lyrics = null; }
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
		}).catch((): any => { });

		if (!MusicMessage) return;

		let collector: any;
		if (options?.createCollector === true) {
			collector = MusicMessage.createMessageComponentCollector({ time: 1800 * 1000 });
			collector.on("collect", async (interaction: any) => {
				await interaction.deferReply({ ephemeral: true });

				const embed: any = {
					author: {
						name: interaction.user.tag,
						icon_url: interaction.user.displayAvatarURL()
					},
					color: Colors.Blue,
					timestamp: new Date()
				}

				if (interaction.customId === "loop") {
					const playerData = bot.music.players.get(interaction?.guild?.id);
					if (!playerData) {
						await interaction.editT("There is no music playing.");
						collector.stop();
					}

					const loopModes = [0, 1, 2];
					const nextLoopMode = loopModes[track.queue.repeatMode + 1] || 0;
					const loopMode = nextLoopMode === 0 ? `${bot.config.emojis.error} Disabled` : `${bot.config.emojis.success} ${nextLoopMode === 1 ? "\`Server Queue\`" : "\`Current Song\`"}`;

					track.queue.setRepeatMode(nextLoopMode).catch((): any => { });

					embed.title = `${bot.config.emojis.music} | Looping ${loopMode}`;
					embed.description = `Looping is now ${loopMode}.`;
				} else if (interaction.customId === "TP") {
					const playerData = bot.music.players.get(interaction?.guild?.id);
					if (!playerData) {
						await interaction.editT("There is no music playing.");
						collector.stop();
					}

					if (playerData?.paused === true) {
						playerData?.pause(false);

						embed.title = `${bot.config.emojis.music} | Music Resumed!`;
						embed.description = `Resumed ${playerData?.queue?.current?.title} by ${playerData?.queue?.current?.author}.`;
						embed.color = Colors.Green;

						TogglePlayingButton.setEmoji(bot.config.emojis.pause).setStyle(ButtonStyle.Danger);
					} else {
						playerData?.pause(true);

						embed.title = `${bot.config.emojis.music} | Music Paused!`;
						embed.description = `Paused ${playerData?.queue?.current?.title} by ${playerData?.queue?.current?.author}.`;
						embed.color = Colors.Red;

						TogglePlayingButton.setEmoji(bot.config.emojis.arrows.right).setStyle(ButtonStyle.Success);
					}

					MusicMessage.editT({
						embeds: [mEmbed],
						components: [{
							type: 1,
							components: [TogglePlayingButton, StopButton, LoopButton]
						}]
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
						.setColor(Colors.Blue);
				}

				interaction.replyT({
					embeds: [embed],
					ephemeral: true
				});
			});

			collector.on("end", async (collected: any) => {
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
