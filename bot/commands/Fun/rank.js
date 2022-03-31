const Discord = require("discord.js");
const canvacord = require("canvacord");

const cmd = require("../../templates/command");

async function execute(bot, message, args, command, data) {
	if (data.guild.plugins.leveling.enabled === "false") return await message.replyT("Leveling is disabled. Please enable it on the dashboard.");

	const Target = data.options.getMember("user") || message.member;
	const TargetMember = await message.guild.members.fetch(Target.user ? Target.user.id : Target.id);

	const userData = await bot.database.getMember(Target.user ? Target.user.id : Target.id, message.guild.id);

	const leaderboard = await bot.MemberSchema.find({
		guildID: message.guild.id
	}).sort([["xp", "descending"]]).exec();

	const Rank = new canvacord.Rank()
		.setUsername(Target.user ? Target.user.username : Target.username)
		.setDiscriminator(Target.user ? Target.user.discriminator : Target.discriminator)
		.setAvatar(Target.displayAvatarURL({ dynamic: false, format: "png" }))
		.setStatus(TargetMember?.presence?.status || "offline")
		.setRank(leaderboard.findIndex(i => i.guildID === message.guild.id && i.id === (Target.user ? Target.user.id : Target.id)) + 1)
		.setLevel(userData.level || 0)
		.setCurrentXP(userData.xp || 0)
		.setRequiredXP(((parseInt(userData.level) + 1) * (parseInt(userData.level) + 1) * 100) || 100)
		.setProgressBar(`#0099ff`, `COLOR`);

	Rank.build().then(async data => {
		const Attachment = new Discord.MessageAttachment(data, `RankCard.png`);

		return await message.replyT({
			files: [Attachment],
		});
	});
}

module.exports = new cmd(execute, {
	description: `View a users rank!`,
	dirname: __dirname,
	aliases: ["level", "xp"],
	usage: `(optional user)`,
	slash: true,
	options: [
		{
			type: 6,
			name: "user",
			description: "The user to get the rank of.",
		}
	]
});
