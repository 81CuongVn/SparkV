const { MessageEmbed } = require(`discord.js`);

const cmd = require("@templates/modCommand");

async function execute(bot, interaction, args, command, data) {
	const user = data.options.getMember("user") || interaction.member;
	const reason = (interaction?.applicationId ? data.options.getString("reason") : args.join(" ").slice(22)) || "No reason provided.";

	if (!user) {
		return await interaction.editT({
			content: `${bot.config.emojis.error} | Please mention someone to warn!`,
			ephemeral: true
		});
	}

	if (user.id === interaction.user.id) {
		return await interaction.editT({
			content: `${bot.config.emojis.error} | You cannot warn yourself lmfao.`,
			ephemeral: true
		});
	}

	const MemberPosition = interaction.member.roles.highest.position;
	const ModerationPosition = interaction.member.roles.highest.position;

	if (interaction.guild.ownerId !== interaction.user.id && !ModerationPosition > MemberPosition) return await interaction.replyT(`${bot.config.emojis.error} | Uh oh... I can\`t warn this user! This user is either the owner, or is a higher rank than SparkV.`);

	const memberData = await bot.database.getMember(user.id, interaction.guild.id);

	++memberData.infractionsCount;
	memberData.infractions.push({
		type: reason,
		date: Date.now(),
	});

	memberData.markModified("infractionsCount");
	memberData.markModified("infractions");
	await memberData.save();

	user.send(`You were warned in **${interaction.guild.name}**. Reason: ${reason}`).catch(async err => {
		await interaction.replyT(`${user}, you were warned in **${interaction.guild.name}**. I would've sent this to you in your DMs, but they were off. Reason: ${reason}.`);
	});

	const WarnEmbed = new MessageEmbed()
		.setAuthor({
			name: `${interaction.user.tag} (${interaction.user.id})`,
			iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
		})
		.setTitle(`Warn Successful`)
		.setDescription(`I successfully warned ${user} (${user.id}).`)
		.setFooter({
			text: bot.config.embed.footer,
			iconURL: bot.user.displayAvatarURL()
		})
		.setColor(bot.config.embed.color);

	await interaction.replyT({
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
