import Discord from "discord.js";

import cmd from "../../../structures/command";

export default new cmd(async (bot: any, message: any, args: string[], command: any, data: any) => {
	const channel: Discord.GuildBasedChannel = data.options.getChannel("channel");
	const type = data.options.getString("type");

	bot.activities.createTogetherCode(channel.id, type)
		.then(async (invite: any) => await message.replyT(`${bot.config.emojis.success} | Click [here](${invite.code}) to start playing **${type}** in ${channel}.`))
		.catch(async (err: any) => await message.replyT(`${bot.config.emojis.alert} | Uh oh! Looks like an error occured. Please try again later. ${err}`));
}, {
	description: "Play a Discord VC activity!",
	usage: "(type (youtube, poker, chess, checkers, betrayal, fishing, lettertile, wordsnack, doodlecrew, spellcast, awkword, puttparty, sketchheads, ocho))",
	dirname: __dirname,
	aliases: [],
	perms: ["UseEmbeddedActivities"],
	bot_perms: ["UseEmbeddedActivities"],
	slash: true,
	options: [{
		type: 7,
		channel_types: [2],
		name: "channel",
		description: "The voice channel to play the activity in.",
		required: true
	}, {
		type: 3,
		name: "type",
		description: "The type of activity.",
		required: true,
		choices: [{
			name: "youtube",
			value: "youtube"
		}, {
			name: "poker",
			value: "poker"
		}, {
			name: "chess",
			value: "chess"
		}, {
			name: "checkers",
			value: "checkers"
		}, {
			name: "betrayal",
			value: "betrayal"
		}, {
			name: "fishing",
			value: "fishing"
		}, {
			name: "lettertile",
			value: "lettertile"
		}, {
			name: "wordsnack",
			value: "wordsnack"
		}, {
			name: "doodlecrew",
			value: "doodlecrew"
		}, {
			name: "spellcast",
			value: "spellcast"
		}, {
			name: "awkword",
			value: "awkword"
		}, {
			name: "puttparty",
			value: "puttparty"
		}, {
			name: "sketchheads",
			value: "sketchheads"
		}, {
			name: "ocho",
			value: "ocho"
		}]
	}]
});
