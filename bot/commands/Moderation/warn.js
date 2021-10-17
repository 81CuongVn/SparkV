const { MessageEmbed } = require(`discord.js`);

const cmd = require("../../templates/modCommand");

async function execute(bot, message, args, command, data) {
	const User = message.mentions.members.first();
	const Reason = args.join(` `).slice(22) || `No reason provided.`;

	if (!User) {
		return await message.replyT(`${bot.config.emojis.error} | Please mention someone to warn!`);
	}

	if (User.id === message.author.id) {
		return await message.replyT(`${bot.config.emojis.error} | You cannot warn yourself lmfao.`);
	}

	const memberData = bot.database.getMember(message.author.id, message.guild.id);
	const MemberPosition = message.member.roles.highest.position;
	const ModerationPosition = message.member.roles.highest.position;

	if (message.guild.ownerId !== message.author.id && !ModerationPosition > MemberPosition) {
		return await message.replyT(
			`${bot.config.emojis.error} | Uh oh... I can\`t warn this user! This user is either the owner, or is a higher rank than SparkV.`,
		);
	}

	++memberData.infractionsCount;
	memberData.infractions.push({
		type: Reason,
		date: Date.now(),
	});

	memberData.markModified("infractionsCount");
	memberData.markModified("infractions");
	await memberData.save();

	User.send(`You were warned in **${message.guild.name}**. Reason: ${Reason}`).catch(async err => {
		message.replyT(
			`You were warned in **${message.guild.name}**. Reason: ${Reason}\n\nI would've sent this in your DMs, but they were off.`,
		);
		await message.replyT(`The user you mentioned has their DMs off. I pinged him instead.`);
	});

	const WarnEmbed = new MessageEmbed()
		.setTitle(`Warn Successful!`)
		.setDescription(`I successfully warned ${User} (${User.id}).`)
		.setFooter(bot.config.embed.footer, bot.user.displayAvatarURL())
		.setColor(bot.config.embed.color);

	await message.replyT({
		embeds: [WarnEmbed],
	});
}

module.exports = new cmd(execute, {
	description: `I will warn a user`,
	dirname: __dirname,
	aliases: [],
	usage: `<user> <optional reason>`,
	perms: ["KICK_MEMBERS"],
});
