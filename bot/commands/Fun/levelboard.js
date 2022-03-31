const Discord = require("discord.js");

const cmd = require("@templates/command");

const Emotes = ["🥇", "🥈", "🥉"];

async function execute(bot, message, args, command, data) {
	if (data.guild.plugins.leveling.enabled === "false") return await message.replyT("Leveling is disabled. Please enable it on the dashboard.");

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
		embeds: [LeaderboardEmbed],
	});
}

module.exports = new cmd(execute, {
	description: `Just a little fun.`,
	dirname: __dirname,
	aliases: ["levelleaderboard", "llb"],
	usage: "",
	slash: true
});
