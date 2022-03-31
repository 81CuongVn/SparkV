const { MessageEmbed } = require(`discord.js`);

const cmd = require("@templates/modCommand");

async function execute(bot, message, args, command, data) {
	const user = message.applicationId ? data.options.getMember("user").user : message.mentions.users.first();
	const reason = (message?.applicationId ? data.options.getString("reason") : args.join(" ").slice(22)) || "No reason provided.";

	if (!user) {
		return await message.editT({
			content: `${bot.config.emojis.error} | Please mention someone to warn!`,
			ephemeral: true
		});
	}

	if (user.id === message.author.id) {
		return await message.editT({
			content: `${bot.config.emojis.error} | You cannot warn yourself lmfao.`,
			ephemeral: true
		});
	}

	const MemberPosition = message.member.roles.highest.position;
	const ModerationPosition = message.member.roles.highest.position;

	if (message.guild.ownerId !== message.author.id && !ModerationPosition > MemberPosition) return await message.replyT(`${bot.config.emojis.error} | Uh oh... I can\`t warn this user! This user is either the owner, or is a higher rank than SparkV.`);

	const memberData = await bot.database.getMember(user.id, message.guild.id);

	++memberData.infractionsCount;
	memberData.infractions.push({
		type: reason,
		date: Date.now(),
	});

	memberData.markModified("infractionsCount");
	memberData.markModified("infractions");
	await memberData.save();

	user.send(`You were warned in **${message.guild.name}**. Reason: ${reason}`).catch(async err => {
		await message.replyT(`${user}, you were warned in **${message.guild.name}**. I would've sent this to you in your DMs, but they were off. Reason: ${reason}.`);
	});

	const WarnEmbed = new MessageEmbed()
		.setAuthor({
			name: `${message.author.tag} (${message.author.id})`,
			iconURL: message.author.displayAvatarURL({ dynamic: true }),
		})
		.setTitle(`Warn Successful`)
		.setDescription(`I successfully warned ${user} (${user.id}).`)
		.setFooter({
			text: bot.config.embed.footer,
			iconURL: bot.user.displayAvatarURL()
		})
		.setColor(bot.config.embed.color);

	await message.replyT({
		embeds: [WarnEmbed],
	});
}

module.exports = new cmd(execute, {
	description: `I will warn a user`,
	dirname: __dirname,
	aliases: [],
	usage: `(user) <optional reason>`,
	perms: ["KICK_MEMBERS"],
	slash: true,
	ephemeral: true,
	options: [
		{
			type: 6,
			name: "user",
			description: "The user to warn.",
			required: true
		},
		{
			type: 3,
			name: "reason",
			description: "The reason for warning the user."
		},
	]
});
