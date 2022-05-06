const Discord = require("discord.js");

const cmd = require("@templates/gameCommand");

module.exports = new cmd(null, {
	description: "Play a Discord VC activity!",
	usage: "(type (youtube, poker, chess, checkers, betrayal, fishing, lettertile, wordsnack, doodlecrew, spellcast, awkword, puttparty, sketchheads, ocho))",
	dirname: __dirname,
	aliases: [],
	perms: ["START_EMBEDDED_ACTIVITIES"],
	bot_perms: ["START_EMBEDDED_ACTIVITIES"],
	type: "activity",
	slash: true,
	options: [
		{
			type: 7,
			channel_types: [2],
			name: "channel",
			description: "The voice channel to play the activity in.",
			required: true
		},
		{
			type: 3,
			name: "type",
			description: "The type of activity.",
			required: true,
			choices: [
				{
					name: "youtube",
					value: "youtube"
				},
				{
					name: "poker",
					value: "poker"
				},
				{
					name: "chess",
					value: "chess"
				},
				{
					name: "checkers",
					value: "checkers"
				},
				{
					name: "betrayal",
					value: "betrayal"
				},
				{
					name: "fishing",
					value: "fishing"
				},
				{
					name: "lettertile",
					value: "lettertile"
				},
				{
					name: "wordsnack",
					value: "wordsnack"
				},
				{
					name: "doodlecrew",
					value: "doodlecrew"
				},
				{
					name: "spellcast",
					value: "spellcast"
				},
				{
					name: "awkword",
					value: "awkword"
				},
				{
					name: "puttparty",
					value: "puttparty"
				},
				{
					name: "sketchheads",
					value: "sketchheads"
				},
				{
					name: "ocho",
					value: "ocho"
				}
			]
		}
	]
});
