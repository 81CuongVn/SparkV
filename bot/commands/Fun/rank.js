const Discord = require(`discord.js`);
const Levels = require(`discord-xp`);
const canvacord = require(`canvacord`);

const cmd = require("../../templates/command");

async function execute(bot, message, args, command, data) {
	if (data.guild.plugins.leveling.enabled === "false") return await message.replyT("Leveling is disabled. Please enable it on the dashboard.");

	const Target = data.options.getMember("user") || message.member;
	const TargetMember = await message.guild.members.fetch(Target.user.id);

	const User = await Levels.fetch(Target.user.id, message.guild.id, true);
	const NeededXP = Levels.xpFor(parseInt(User.level) + 1);

	if (!User) return await message.replyT(`${bot.config.emojis.error} | This user hasn't earned any XP yet!`);

	const Rank = new canvacord.Rank()
		.setUsername(Target.user ? Target.user.username : Target.username)
		.setDiscriminator(Target.user ? Target.user.discriminator : Target.discriminator)
		.setAvatar(Target.displayAvatarURL({ dynamic: false, format: "png" }))
		.setStatus(TargetMember?.presence?.status || "offline")
		.setRank(User.position)
		.setLevel(User.level || 0)
		.setCurrentXP(User.xp || 0)
		.setRequiredXP(NeededXP || 100)
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
