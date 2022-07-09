import Discord, { ButtonStyle, Colors } from "discord.js";
import { Track } from "erela.js";

import cmd from "../../../Structures/command";

const Emotes = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];

async function execute(bot: any, message: any, args: string[], command: any, data: any) {
	if (!message?.member?.voice?.channel) return message.replyT(`${bot.config.emojis.alert} | You must be in a voice channel to use this command.`);

	const state = message.options.getSubcommand();
	const embed = new Discord.EmbedBuilder()
		.setAuthor({
			name: message.user.tag,
			iconURL: message.user.displayAvatarURL()
		})
		.setColor(Colors.Blue)
		.setTimestamp();

	const playerData = bot.music.players.get(message?.guild?.id);
	if (state === "song") {
		const type = message.options.getString("action");
		const number = parseInt(message.options.getNumber("number"));

		if (!playerData) return message.replyT(`${bot.config.emojis.alert} | There is nothing in the queue right now!`);

		if (type === "volume") {
			if (number > 100) return message.replyT(`${bot.config.emojis.alert} | Songs cannot go louder than 100%.`);

			playerData.setVolume(number);
			return await message.replyT({ embeds: [embed.setDescription(`${bot.config.emojis.music} | The volume is now set to ${number}%.`).setColor(ButtonStyle.Success)] });
		} else if (type === "forward") {
			let forward = playerData.queue.currentTime + number;
			if (forward < 0) forward = 0;
			if (forward >= playerData.queue.songs[0].duration) forward = playerData.queue.songs[0].duration - 1;

			await playerData.queue.seek(forward);
			return await message.replyT({ embeds: [embed.setDescription(`${bot.config.emojis.music} | I forwarded the song by ${number} seconds ahead.`).setColor(ButtonStyle.Success)] });
		} else if (type === "rewind") {
			let rewind = playerData.queue.currentTime - number;7
			if (rewind < 0) rewind = 0;
			if (rewind >= playerData.queue.songs[0].duration - playerData.queue.currentTime) rewind = 0;

			await playerData.queue.seek(rewind);
			return await message.replyT({
				embeds: [embed.setDescription(`${bot.config.emojis.music} | I rewinded the song by ${number} seconds.`).setColor(ButtonStyle.Success)]
			});
		}
	} else if (state === "play") {
		const query = data.options.getString("search");
		if (!query) return await message.replyT(`${bot.config.emojis.error} | Please enter a song URL or query to search!`);

		const searchData = {
			query,
			user: message.user
		};
		// No YouTube: if (!(query.includes("http://") || query.includes("https://"))) searchData.source = "soundcloud";

		const queryData = await bot.music.search(searchData);
		const track = queryData.tracks[0];
		if (!track) return await message.replyT(`${bot.config.emojis.alert} | No results found for that query.`);

		const player = bot.music.create({
			guild: message.guild.id,
			voiceChannel: message.member.voice.channel.id,
			textChannel: message.channel.id,
			selfDeafen: true
		});
		player.set("requester", message.user);

		player.connect();
		player.queue.add(track);
		await message.replyT(`${bot.config.emojis.search} | Searching for **${query}**...`);

		if (!player.playing) player.play();

		// If the track is the first song in the queue, don't send the message.
		console.log(player?.queue?.size)
		if (player?.queue?.size > 0) {
			const playerData = bot.music.players.get(message.guild.id);
			const SongAddedQueue = new Discord.EmbedBuilder()
				.setTitle(`${bot.config.emojis.music} | Added ${track?.title} to Queue`)
				.setURL(track?.uri)
				.setThumbnail(track?.thumbnail)
				.addFields([
					{
						name: `${bot.config.emojis.player} Uploader`,
						value: `\`\`\`${track?.author}\`\`\``,
						inline: true
					},
					{
						name: `${bot.config.emojis.clock} Duration`,
						value: `\`\`\`${track?.duration}\`\`\``,
						inline: true
					},
					{
						name: `${bot.config.emojis.volume} Volume`,
						value: `\`${playerData?.volume}%\``,
						inline: true
					},
					{
						name: `${bot.config.emojis.loop} Loop`,
						value: `${playerData.trackRepeat ? `${bot.config.emojis.success} \`Enabled: Song\`` : playerData.queueRepeat ? `${bot.config.emojis.success} \`Enabled: Queue\`` : `${bot.config.emojis.error} \`Disabled\``}`,
						inline: true
					}
				])
				.setColor(Colors.Blue)
				.setTimestamp();

			await bot.music.handleMusic(playerData, track, SongAddedQueue, {
				includeLoop: false,
				includePause: false,
				includeStop: false,
				includeLyrics: false,
				createCollector: false
			});
		}
	} else if (state === "lyrics") {
		const query = data.options.getString("search");
		if (!query) return message.replyT(`${bot.config.emojis.error} | Please supply the title of a song to search for.`);

		let lyrics;
		try {
			lyrics = await (await bot.lyricsClient.songs.search(query))[0].lyrics();
		} catch (err: any) {
			lyrics = null;
		}

		if (!lyrics) return await message.replyT(`${bot.config.emojis.error} | I couldn't find the lyrics for **${query}**!`);

		const LyricsArray = lyrics.split(`\n`);
		const LyricsSubArray: any[] = [];
		const pages: any[] = [];

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
			components: [{
				type: 1,
				components: [
					new Discord.ButtonBuilder()
						.setEmoji("⬅️")
						.setCustomId("quickLeft")
						.setStyle(ButtonStyle.Secondary),
					new Discord.ButtonBuilder()
						.setEmoji(bot.config.emojis.arrows.left)
						.setCustomId("left")
						.setStyle(ButtonStyle.Secondary),
					new Discord.ButtonBuilder()
						.setEmoji(bot.config.emojis.arrows.right)
						.setCustomId("right")
						.setStyle(ButtonStyle.Secondary),
					new Discord.ButtonBuilder()
						.setEmoji("➡️")
						.setCustomId("quickRight")
						.setStyle(ButtonStyle.Secondary)
				]
			}],
			fetchReply: true
		});

		let PageNumber = 0;
		const collector = msg.createMessageComponentCollector({ time: 300 * 1000 });
		collector.on("collect", async (interaction: any) => {
			if (!interaction.deferred) interaction.deferUpdate().catch((): any => { });
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
			} catch (err: any) { }
		});
		collector.on("end", async (interaction: any) => {
			try {
				interaction.edit({ components: [] });
			} catch (err: any) { }
		});
	} else if (state === "skip") {
		if (!playerData) return message.replyT(`${bot.config.emojis.alert} | There is nothing in the queue right now!`);

		const number = data.options.getNumber("number");
		if (number) {
			try {
				bot.music.jump(message, number);

				return await message.replyT(`${bot.config.emojis.music} | I successfully jumped to song #${number} in queue!`);
			} catch (err: any) {
				return await message.replyT(`${bot.config.emojis.error} | Invalid song number!`);
			}
		}

		playerData.stop();
		await message.replyT({
			embeds: [
				embed
					.setDescription(`**${bot.config.emojis.alert} | Skipped song!**\nSkiped to the next song in queue.`)
					.setColor(Colors.Red)
					.setTimestamp()
			]
		});
	} else if (state === "loop") {
		if (!playerData) return message.replyT(`${bot.config.emojis.alert} | There is nothing in the queue right now!`);

		const state2 = data.options.getString("state");
		const type = data.options.getString("type");
		let mode;

		if (state2 === "on") {
			if (type === `song`) mode = 1;
			else if (type === `queue`) mode = 2;
		} else if (state2 === "off") {
			mode = 0;
		}

		playerData.settrackRepeat(mode);
		await message.replyT({
			embeds: [
				embed
					.setDescription(`${bot.config.emojis.music} | Okay, I ${state2 === "off" ? `stopped the loop.` : `looped the ${type}.`}`)
					.setTimestamp()
					.setColor(Colors.Red)
			]
		});
	} else if (state === "manage") {
		const type = data.options.getString("action");

		if (type === "join") {
			try {
				const player = bot.music.create({
					guild: message.guild.id,
					voiceChannel: message.member.voice.channel.id,
					textChannel: message.channel.id,
					selfDeafen: true
				});
				player.set("requester", message.user);
				player.connect();

				message.replyT(`${bot.config.emojis.music} | Successfully joined the voice channel.`);
			} catch (err: any) {
				return message.editT(`${bot.config.emojis.error} | I cannot join the voice channel! Please make sure I have the permission to join the voice channel nad that the voice channel is not full.`);
			}
		} else if (type === "leave") {
			if (!playerData) return message.replyT(`${bot.config.emojis.alert} | There is nothing in the queue right now!`);

			try {
				bot.music.disconnect(message.member.voice.channel);

				return await message.replyT("Successfully left voice channel.");
			} catch (err: any) {
				return message.replyT(`${bot.config.emojis.error} | I cannot join the voice channel! Please make sure I have the permission to join the voice channel nad that the voice channel is not full.`);
			}
		} else if (type === "stop") {
			if (!playerData) return message.replyT(`${bot.config.emojis.alert} | There is nothing in the queue right now!`);

			playerData.stop();
			await message.replyT(`${bot.config.emojis.error} | Successfully stopped the queue!`);
		} else if (type === "queue") {
			if (!playerData) return message.replyT(`${bot.config.emojis.alert} | There is nothing in the queue right now!`);

			const queueSongs = playerData?.queue?.songs?.map((song: Track, id: number) => `${Emotes[id] || (id + 1)} **${song.title}** - ${bot.music.formatDuration(song.duration)}`).slice(0, 10);
			const queueEmbed = new Discord.EmbedBuilder()
				.setAuthor({
					name: message.user.tag,
					iconURL: message.user.displayAvatarURL()
				})
				.setTitle(`${bot.config.emojis.music} | ${message.guild.name}'s Music Queue`)
				.setDescription(queueSongs.join("\n"))
				.setColor(Colors.Blue)
				.setThumbnail(message.guild.iconURL({ dynamic: true }))
				.setFooter({
					text: `${message.guild.name}'s Music Queue`,
					iconURL: bot.user.displayAvatarURL()
				});

			return await message.replyT({
				embeds: [queueEmbed]
			});
		} else if (type === "nowplaying") {
			if (!playerData) return message.replyT(`${bot.config.emojis.alert} | There is nothing in the queue right now!`);

			const track = playerData?.queue?.current;
			embed
				.setTitle(`${bot.config.emojis.music} | Currently Playing ${track?.title}`)
				.setURL(track?.uri)
				.setThumbnail(track?.thumbnail)
				.addFields([
					{
						name: `${bot.config.emojis.player} Uploader`,
						value: `\`\`\`${track?.author}\`\`\``,
						inline: true
					},
					{
						name: `${bot.config.emojis.clock} Duration`,
						value: `\`\`\`${track?.duration}\`\`\``,
						inline: true
					},
					{
						name: `${bot.config.emojis.music} Songs [${playerData?.queue?.totalSize}]`,
						value: `\`${playerData?.queue?.map((song: Track, id: number) => `${Emotes[id] || (id + 1)} **${song.title}** - ${bot.music.formatDuration(song.duration)}`).slice(0, 10)}\``,
						inline: false
					},
					{
						name: `${bot.config.emojis.volume} Volume`,
						value: `\`${playerData?.volume}%\``,
						inline: true
					},
					{
						name: `${bot.config.emojis.loop} Loop`,
						value: `${playerData.trackRepeat ? `${bot.config.emojis.success} \`Enabled: Song\`` : playerData.queueRepeat ? `${bot.config.emojis.success} \`Enabled: Queue\`` : `${bot.config.emojis.error} \`Disabled\``}`,
						inline: true
					}
				])
				.setURL(track.uri)
				.setColor(Colors.Blue)
				.setTimestamp();

			await bot.music.handleMusic(playerData, track, embed, {
				includeLoop: true,
				includePause: true,
				includeStop: true,
				includeLyrics: true,
				createCollector: true
			});
		} else if (type === "previous") {
			const queue = await bot.music.getQueue(message);

			if (!queue) return await message.replyT(`${bot.config.emojis.error} | No songs in queue.`);
			if (!queue.previousSongs || queue.previousSongs.length === 0) return await message.replyT(`${bot.config.emojis.error} | There are no previous songs.`);

			const song = queue.previous();

			await message.replyT(`${bot.config.emojis.music} | Now playing ${song.name}.`);
		} else if (type === "pause") {
			if (!playerData) return message.replyT(`${bot.config.emojis.alert} | There is nothing in the queue right now!`);

			if (playerData?.paused === true) {
				playerData?.pause(false);

				return await message.replyT(`${bot.config.emojis.music} | Successfully resumed the music!`);
			}

			playerData.pause(true);
			await message.replyT(`${bot.config.emojis.music} | Successfully paused the music!`);
		} else if (type === "resume") {
			if (!playerData) return message.replyT(`${bot.config.emojis.alert} | There is nothing in the queue right now!`);

			if (playerData?.playing === true) {
				playerData.pause(true);

				return await message.replyT(`${bot.config.emojis.music} | Successfully paused the music!`);
			}

			playerData.pause(false);
			await message.replyT(`${bot.config.emojis.music} | Successfully resumed the music. Enjoy!`);
		} else if (type === "shuffle") {
			if (!playerData) return message.replyT(`${bot.config.emojis.alert} | There is nothing in the queue right now!`);

			playerData?.queue?.shuffle();
			await message.replyT(`${bot.config.emojis.music} | Okay, I shuffled the queue.`);
		}
	}
}

export default new cmd(execute, {
	description: "<:music:947988551805575189> Play music in your Discord server.",
	dirname: __dirname,
	aliases: [],
	usage: "",
	slash: true,
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
