const Discord = require(`discord.js`);
const Levels = require(`discord-xp`);
const canvacord = require(`canvacord`);

const cmd = require("../../templates/command");

async function execute(bot, message, args, command, data) {
	if (data.guild.plugins.leveling.enabled === "false") return await message.replyT("Leveling is disabled. Please enable it on the dashboard.");

	let Target = await bot.functions.fetchUser(args[0]) || message.author;
	Target = await message.guild.members.fetch(Target);

	const User = await Levels.fetch(Target.user.id, message.guild.id, true);
	const NeededXP = Levels.xpFor(parseInt(User.level) + 1);

	if (!User) return await message.replyT(`${bot.config.emojis.error} | This user hasn't earned any XP yet!`);

	const Rank = new canvacord.Rank()
		.setUsername(Target.user.username)
		.setDiscriminator(Target.user.discriminator)
		.setAvatar(Target.user.displayAvatarURL({ dynamic: false, format: "png" }))
		.setStatus(Target.presence?.status)
		.setRank(User.position)
		.setLevel(User.level || 0)
		.setCurrentXP(User.xp || 0)
		.setRequiredXP(NeededXP || 100)
		.setProgressBar(`#0099ff`, `COLOR`);

	Rank.build().then(async data => {
		const Attachment = new Discord.MessageAttachment(data, `${Target.user.tag}RankCard.png`);

		return await message.replyT({
			files: [Attachment],
		});
	});
}

module.exports = new cmd(execute, {
	description: `View a users rank!`,
	dirname: __dirname,
	aliases: ["level", "xp"],
	usage: `<optional user>`,
});
