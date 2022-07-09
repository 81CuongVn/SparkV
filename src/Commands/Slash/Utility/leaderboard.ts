import Discord, { Colors } from "discord.js";

import cmd from "../../../Structures/command";

const Emotes = ["🥇", "🥈", "🥉"];

async function execute(bot: any, message: any, args: string[], command: any, data: any) {
	const type = data.options.getString("type");

	if (type === "leveling") {
		if (data.guild.leveling.enabled === "false") return await message.replyT("Leveling is disabled. Please enable it on the settings panel.");

		let TopMembers = await bot.MemberSchema.find({ guildID: message.guild.id }).sort([["xp", "descending"]]).exec();
		TopMembers = TopMembers.slice(0, 10);

		const Leaderboard = [];
		for (const data of TopMembers) {
			const user = await bot.users.fetch(data.id) || { username: "Unknown", discriminator: "0000" };

			Leaderboard.push({
				id: data.id,
				xp: data.xp,
				level: data.level,
				rank: TopMembers.findIndex((i: any) => i.guildID === data.guildID && i.id === data.id) + 1,
				username: user.username,
				discriminator: user.discriminator
			});
		}

		await message.replyT({
			embeds: [{
				title: `${message.guild.name}'s Level Leaderboard`,
				description: Leaderboard.map(data => `${Emotes[data.rank - 1] || "🏅"} **Level ${data.level}** - ${data.username}#${data.discriminator}`).join("\n"),
				color: "BLUE",
				timestamp: new Date(),
				footer: {
					text: `${bot.user.username} • ${bot.config.embed.footer}`,
					iconURL: bot.user.displayAvatarURL()
				}
			}]
		});
	} else if (type === "money") {
		const global = data.options.getBoolean("global") || false;
		let Leaderboard = await bot.UserSchema.find({});

		Leaderboard = Leaderboard
			.sort((a: any, b: any) => b.money.balance - a.money.balance)
			.filter((user: any) => bot.users.cache.has(user.id))
			.slice(0, 10);

		if (global === false) Leaderboard = Leaderboard.filter((user: any) => message.guild.members.cache.has(user.id));

		let rank = 0;
		await message.replyT({
			embeds: [{
				title: `${message.guild.name}'s Money Leaderboard`,
				description: Leaderboard.map(async (data: any) => {
					rank++;
					const user = await bot.users.fetch(data.id);

					return `${Emotes[rank - 1] || "🏅"} **⏣${bot.functions.formatNumber(data.money.balance)}** - ${user.tag}`;
				}).join("\n"),
				color: Colors.Green,
				timestamp: new Date(),
				footer: {
					text: `${bot.user.username} • ${bot.config.embed.footer}`,
					icon_url: bot.user.displayAvatarURL()
				}
			}]
		});
	}
}

export default new cmd(execute, {
	description: "View the top 10 users for leveling and money.",
	dirname: __dirname,
	aliases: [],
	usage: "",
	slash: true,
	options: [
		{
			type: 3,
			name: "type",
			description: "The type of leaderboard to view.",
			required: true,
			choices: [
				{
					name: "leveling",
					value: "leveling"
				},
				{
					name: "money",
					value: "money"
				}
			]
		},
		{
			type: 5,
			name: "global",
			description: "Whether we should show you the global money leaderboard instead of the server money leaderboard."
		}
	]
});
