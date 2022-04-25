const Discord = require("discord.js");

const cmd = require("@templates/command");

const Emotes = ["🥇", "🥈", "🥉"];

async function execute(bot, message, args, command, data) {
	const type = data.options.getString("type");

	if (type === "leveling") {
		if (data.guild.leveling.enabled === "false") return await message.replyT("Leveling is disabled. You can enable it on my settings panel, by typing `/settings`");

		let TopMembers = await bot.MemberSchema.find({ guildID: message.guild.id }).sort([["xp", "descending"]]).exec();
		TopMembers = TopMembers.slice(0, 10);

		const Leaderboard = [];
		for (const data of TopMembers) {
			const user = await bot.users.fetch(data.id) || { username: "Unknown", discriminator: "0000" };

			Leaderboard.push({
				id: data.id,
				xp: data.xp,
				level: data.level,
				rank: TopMembers.findIndex(i => i.guildID === data.guildID && i.id === data.id) + 1,
				username: user.username,
				discriminator: user.discriminator
			});
		}

		const LeaderboardEmbed = new Discord.MessageEmbed()
			.setTitle(`${message.guild.name}'s Level Leaderboard`)
			.setDescription(Leaderboard.map(data => `${Emotes[data.rank - 1] || "🏅"} **Level ${data.level}** - ${data.username}#${data.discriminator}`).join("\n"))
			.setFooter({
				text: `${bot.user.username} • ${bot.config.embed.footer}`,
				iconURL: bot.user.displayAvatarURL({ dynamic: true })
			})
			.setColor(bot.config.embed.color);

		await message.replyT({
			embeds: [LeaderboardEmbed]
		});
	} else if (type === "money") {
		const global = data.options.getBoolean("global") || false;
		let Leaderboard = await bot.UserSchema.find({});

		Leaderboard = Leaderboard
			.sort((a, b) => b.money.balance - a.money.balance)
			.filter(user => bot.users.cache.has(user.id))
			.slice(0, 10);

		if (global === false) Leaderboard = Leaderboard.filter(user => message.guild.members.cache.has(user.id));

		let rank = 0;
		const LeaderboardEmbed = new Discord.MessageEmbed()
			.setTitle(`${message.guild.name}'s Money Leaderboard`)
			.setDescription(Leaderboard.map(data => {
				rank++;
				const user = bot.users.cache.get(data.id);

				return `${Emotes[rank - 1] || "🏅"} **⏣${bot.functions.formatNumber(data.money.balance)}** - ${user.tag}`;
			}).join("\n"))
			.setFooter({
				text: `${bot.user.username} • ${bot.config.embed.footer}`,
				iconURL: bot.user.displayAvatarURL({ dynamic: true })
			})
			.setColor("GREEN")
			.setTimestamp();

		await message.replyT({
			embeds: [LeaderboardEmbed]
		});
	}
}

module.exports = new cmd(execute, {
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
