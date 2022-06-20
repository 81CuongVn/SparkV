import Discord from "discord.js";

import cmd from "../../../structures/command";

export default new cmd(async (bot: any, message: any, args: string[], command: any, data: any) => {
	const channel: Discord.GuildBasedChannel = data.options.getChannel("channel");
	const type = data.options.getString("type");

	await fetch(`https://discord.com/api/v8/channels/${channel.id}/invites`, {
		method: 'POST',
		body: JSON.stringify({
		  max_age: 86400,
		  max_uses: 0,
		  target_application_id: type,
		  target_type: 2,
		  temporary: false,
		  validate: null,
		}),
		headers: {
		  Authorization: `Bot ${bot.client.token}`,
		  'Content-Type': 'application/json',
		},
	  }).then((res) => res.json())
		.then((invite) => {
		  if (invite.error || !invite.code) throw new Error('An error occured while retrieving data !');
		  if (Number(invite.code) === 50013) console.warn('Your bot lacks permissions to perform that action');
		  returnData.code = `https://discord.com/invite/${invite.code}`;
		});

	bot.discordTogether.createTogetherCode(channel?.id, type?.toLowerCase())
		.then(async invite => await message.replyT(`${bot.config.emojis.success} | Click [here](${invite.code}) to start playing **${type}** in ${channel}.`))
		.catch(async err => await message.replyT(`${bot.config.emojis.alert} | Uh oh! Looks like an error occured. Sorry about that. Please try again later.`));
}, {
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
