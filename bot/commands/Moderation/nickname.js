const Discord = require(`discord.js`);

const cmd = require("../../templates/modCommand");

async function execute(bot, message, args, command, data) {
	const User =
    message.guild.member(message.mentions.users.first()) || message.guild.members.cache.get(args[0]) || `@<${args[0]}>`;
	const NewNickname = args.join(` `).slice(22);

	if (!args[0]) {
		return message
			.replyT(`${bot.config.emojis.error} | Please mention someone to change their nickname!`);
	}

	if (!User) {
		return message
			.replyT(`${bot.config.emojis.error} | I cannot find that member!`);
	}

	if (!User.roles) {
		return message
			.replyT(`${bot.config.emojis.error} | That\`s not a user! That\`s a role.`);
	}

	if (!NewNickname) {
		return message
			.replyT(`${bot.config.emojis.error} | Please mention their new nickname!`);
	}

	if (User.roles.highest.comparePositionTo(message.guild.me.roles.highest) >= 0) {
		return await message.replyT(`Uh oh! I cannot change their nickname. They\`re a higher role than me!`);
	}

	const VerificationEmbed = new Discord.MessageEmbed()
		.setTitle(`Convermination Prompt`)
		.setDescription(`Are you sure you want to do this?`)
		.setFooter({
			text: `Canceling in 60 seconds if no emoji reacted. • ${bot.config.embed.footer}`,
			iconURL: bot.user.displayAvatarURL({ dynamic: true })
		});

	const VerificationMessage = await await message.replyT({
		embeds: [VerificationEmbed],
	});

	const Emoji = await bot.PromptMessage(
		VerificationMessage,
		message.author,
		[bot.config.emojis.success, bot.config.emojis.error],
		60,
	);

	if (Emoji === bot.config.emojis.success) {
		// Yes
		message.delete().catch(err => {});
		Verificationmessage.delete().catch(err => {});

		User.setNickname(NewNickname)
			.then(async () => await message.replyT(`${bot.config.emojis.success} | I successfully changed ${User}\`s nickname to ${NewNickname}!`))
			.catch(async err => {
				await message.replyT(`${bot.config.emojis.error} | Uh oh! I cannot change their nickname.`).then(() => {
					console.error(err);
				});
			});
	} else if (emoji === bot.config.emojis.error) {
		message.delete().catch(err => {});

		await message.replyT(`${bot.config.emojis.error} | Nickname change canceled.`).then(m => m.delete({ timeout: 10000 }));
	}
}

module.exports = new cmd(execute, {
	description: `I\'ll change a user\'s nickname to your choice.`,
	dirname: __dirname,
	aliases: ["setnick"],
	usage: `<user> <reason>`,
	perms: ["CHANGE_NICKNAME"],
});
