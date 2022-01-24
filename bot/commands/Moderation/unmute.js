const Discord = require(`discord.js`);

const cmd = require("../../templates/modCommand");

async function execute(bot, message, args, command, data) {
	const User =
    message.guild.member(message.mentions.users.first()) || message.guild.members.cache.get(args[0]) || `@<${args[0]}>`;
	const Reason = args.join(` `).slice(22) || `No reason provided.`;

	if (!args[0]) {
		return message
			.replyT(`${bot.config.emojis.error} | Please mention someone to mute!`);
	}

	if (!User) {
		return message
			.replyT(`${bot.config.emojis.error} | I cannot find that member!`);
	}

	if (User.id === message.author.id) {
		return message
			.replyT(`${bot.config.emojis.error} | You cannot unmute yourself.`);
	}

	if (!User.kickable) {
		return message
			.replyT(`${bot.config.emojis.error} | Uh oh... I can't unmute this user!`);
	}

	const Role = message.guild.roles.cache.find(role => role.name.toLowerCase().includes(`muted`));

	if (!Role) {
		return await message.replyT(
			`${bot.config.emojis.error} | I couldn't find the muted role! Please make sure the role is called, \`Muted\`.`,
		);
	}

	if (User.roles.cache.has(Role)) {
		return await message.replyT(`${bot.config.emojis.error} | This user isn't muted!`);
	}

	const VerificationEmbed = new Discord.MessageEmbed()
		.setTitle(`Convermination Prompt`)
		.setDescription(`Are you sure you want to do this?`)
		.setFooter({
			text: `Canceling in 60 seconds if no emoji reacted. • ${bot.config.embed.footer}`,
			iconURL: bot.user.displayAvatarURL({ dynamic: true })
		});

	const VerificationMessage = await await message.replyT(VerificationEmbed);
	const Emoji = await bot.PromptMessage(
		VerificationMessage,
		message.author,
		[bot.config.emojis.success, bot.config.emojis.error],
		60,
	);

	if (Emoji === bot.config.emojis.success) {
		// Yes
		message.delete().catch(err => {});

		User.roles.remove(Role);
		User.send(
			`${bot.config.emojis.success} | You have been unmuted in ${message.guild.name}. Reason: ${Reason}.`,
		).catch(err => {});

		const MuteEmbend = new Discord.MessageEmbed()
			.setTitle(`${bot.config.emojis.success} | Unmute Command`)
			.setDescription(`Successfully unmuted ${User}(${User.id})`)
			.setThumbnail(User.avatar)
			.addField(`Moderator/Admin: `, `${message.author.tag}`)
			.addField(`Reason: `, Reason)
			.setFooter({
				text: `${bot.config.prefix}Mute to mute a user • ${bot.config.embed.footer}`,
				iconURL: bot.user.displayAvatarURL({ dynamic: true })
			})
			.setColor(bot.config.embed.color)
			.setTimestamp();

		await message.replyT({
			embeds: [MuteEmbend],
		});
	} else if (emoji === bot.config.emojis.error) {
		message.delete().catch(err => {});

		await message.replyT(`${bot.config.emojis.error} | Unmute canceled.`).then(m => m.delete({ timeout: 10000 }));
	}
}

module.exports = new cmd(execute, {
	description: `I'll unmute someone who was muted previously.`,
	dirname: __dirname,
	aliases: [],
	usage: `(user) <reason>`,
	perms: ["MANAGE_CHANNELS"],
});
