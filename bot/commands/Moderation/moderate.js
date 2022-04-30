const Discord = require("discord.js");

const cmd = require("@templates/modCommand");

async function execute(bot, interaction, args, command, data) {
	const action = data.options.getString("action");
	const user = data.options.getMember("user");
	const reason = data.options.getString("reason") || "No reason provided.";

	if ((user.user ? user.user : user).id === interaction.user.id) return await interaction.editT(`${bot.config.emojis.error} | Nice try, you cannot moderate yourself.`);

	const MemberPosition = interaction.member.roles.highest.position;
	const ModerationPosition = interaction.member.roles.highest.position;

	if (interaction.guild.ownerId !== interaction.user.id && !ModerationPosition > MemberPosition) return await interaction.editT(`${bot.config.emojis.alert} | Uh oh... I can\`t warn this user! This user is either the owner, or is a higher rank than SparkV.`);
	if (!user.moderatable) return interaction.editT(`${bot.config.emojis.alert} | I cannot moderate this user.`);

	const embed = new Discord.EmbedBuilder()
		.setAuthor({
			name: interaction.user.tag,
			iconURL: interaction.user.displayAvatarURL({ dynamic: true })
		})
		.setColor("#57F287")
		.setTimestamp();

	if (action === "warn") {
		const memberData = await bot.database.getMember((user.user ? user.user : user).id, interaction.guild.id);

		++memberData.infractionsCount;
		memberData.infractions.push({
			type: reason,
			date: Date.now()
		});

		memberData.markModified("infractionsCount");
		memberData.markModified("infractions");
		await memberData.save();

		user
			.send(`${bot.config.emojis.warning} | You were warned in **${interaction.guild.name}**. **${reason}**`)
			.catch(async err => await interaction.replyT(`${user}, you were warned in **${interaction.guild.name}**. I would've sent this to you in your DMs, but they were off. ${reason}.`));

		embed.setDescription(`**${bot.config.emojis.alert} | Warn Successful**\nSuccessfully warned ${user}. **${reason}**`).setColor("#57F287");

		bot.emit("userWarnAdd", interaction.guild, user, reason);
	} else if (action === "kick") {
		user.send(`${bot.config.emojis.alert} | You have been kicked from ${interaction.guild.name}. **${reason}**.`).catch(err => {});
		user.kick({
			reason
		}).catch(async err => await message.editT(`${bot.config.emojis.error} | Failed to kick user. Please check my permisions and try again.`));

		embed.setDescription(`**${bot.config.emojis.alert} | Warn Successful**\nSuccessfully warned ${user}. **${reason}*.`);
	} else if (action === "ban") {
		user.send(`${bot.config.emojis.alert} | You have been banned from **${interaction.guild.name}**. **${reason}**`).catch(err => {});
		user.ban({
			reason
		}).catch(async err => await interaction.editT(`${bot.config.emojis.error} | Failed to ban user. Please check my permissions and try again.`));

		embed.setDescription(`**${bot.config.emojis.alert} | Ban Successful**\nSuccessfully banned ${user}. **${reason}*`);
	}

	await interaction.editT({
		embeds: [embed]
	});
}

module.exports = new cmd(execute, {
	description: "Moderate a user. (Warn/Kick/Ban)",
	dirname: __dirname,
	aliases: [],
	usage: "(user) (reason)",
	perms: ["ModerateMembers"],
	bot_perms: ["ModerateMembers"],
	slash: true,
	ephemeral: true,
	options: [
		{
			type: 3,
			name: "action",
			description: "The action to take. (Warn/Kick/Ban)",
			required: true,
			choices: [
				{
					name: "warn",
					value: "warn"
				},
				{
					name: "kick",
					value: "kick"
				},
				{
					name: "ban",
					value: "ban"
				}
			]
		},
		{
			type: 6,
			name: "user",
			description: "The user to kick.",
			required: true
		},
		{
			type: 3,
			name: "reason",
			description: "The reason for moderating this user."
		}
	]
});
