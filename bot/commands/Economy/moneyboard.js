const Discord = require("discord.js");

const cmd = require("../../templates/command");

const Emotes = ["🥇", "🥈", "🥉"];

async function execute(bot, message, args, command, data) {
	const global = data.options.getBoolean("global") || false;
	let Leaderboard = await bot.UserSchema.find({});

	Leaderboard = Leaderboard
		.sort((a, b) => b.money.balance - a.money.balance)
		.filter(user => bot.users.cache.has(user.id));

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
		embeds: [LeaderboardEmbed],
	});
}

module.exports = new cmd(execute, {
	description: `Just a little fun.`,
	dirname: __dirname,
	aliases: ["moneyleaderboard", "mlb"],
	usage: "",
	slash: true,
	slashOnly: true,
	options: [
		{
			type: 5,
			name: "global",
			description: "Whether we should show you the global money leaderboard instead of the server money leaderboard."
		}
	]
});
