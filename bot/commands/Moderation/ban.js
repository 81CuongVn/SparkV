const { MessageEmbed, Permissions } = require("discord.js");

const cmd = require("@templates/modCommand");

async function execute(bot, interaction, args, command, data) {
	const user = data.options.getMember("user");
	const reason = data.options.getString("reason") || "No reason provided.";

	if ((user.user ? user.user : user).id === interaction.user.id) return await interaction.editT(`${bot.config.emojis.error} | You cannot warn yourself.`);

	const MemberPosition = interaction.member.roles.highest.position;
	const ModerationPosition = interaction.member.roles.highest.position;

	if (interaction.guild.ownerId !== interaction.user.id && !ModerationPosition > MemberPosition) return await interaction.replyT(`${bot.config.emojis.error} | Uh oh... I can\`t warn this user! This user is either the owner, or is a higher rank than SparkV.`);

	message.delete().catch(err => {});
	user.send(`${bot.config.emojis.error} | You have been banned from ${message.guild.name}. Reason: ${ReasonForBan}.`,).catch(err => {});

	user.ban({
		reason,
	}).catch(async err => await message.replyT(`${bot.config.emojis.error} | Failed to ban. Please check my permissions and try again.`));

	const WarnEmbed = new MessageEmbed()
		.setAuthor({
			name: `${interaction.user.tag} (${interaction.user.id})`,
			iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
		})
		.setTitle(`${bot.config.emojis.success} Ban Successful`)
		.setDescription(`I successfully banned ${user} (${user.id}).`)
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
	description: "Ban a user, effectively removing them permanently from your server.",
	dirname: __dirname,
	usage: "(user) (optional: reason)",
	aliases: [],
	perms: ["BAN_MEMBERS"],
	bot_perms: ["BAN_MEMBERS"],
	slash: true,
	slashOnly: true,
	ephemeral: true,
	options: [
		{
			type: 6,
			name: "user",
			description: "The user to ban.",
			required: true
		},
		{
			type: 3,
			name: "reason",
			description: "The reason for the ban."
		}
	]
});
