const { MessageEmbed, Permissions } = require("discord.js");

const cmd = require("../../templates/modCommand");

async function execute(bot, message, args, command, data) {
	const UserToBan = bot.functions.GetMember(message, args);
	const ReasonForBan = args.join(` `).slice(22) || `No reason provided.`;

	if (!args[0]) {
		return message
			.replyT(`${bot.config.emojis.error} | Please mention someone to ban!`);
	}

	if (!UserToBan) {
		return message
			.replyT(`${bot.config.emojis.error} | I cannot find that member!`);
	}

	if (UserToBan.id === message.author.id) {
		return message
			.replyT(`${bot.config.emojis.error} | You cannot ban yourself.`);
	}

	if (!UserToBan.bannable) {
		return message
			.replyT(`${bot.config.emojis.error} | Uh oh... I can\`t ban this user!`);
	}

	message.delete().catch(err => {});
	UserToBan.send(
		`${bot.config.emojis.error} | You have been banned from ${message.guild.name}. Reason: ${ReasonForBan}.`,
	).catch(err => {});

	UserToBan.ban({
		reason: ReasonForBan,
	}).catch(async err => await message.replyT(`${bot.config.emojis.error} | Failed to ban. Error: ${err}`));

	const BanEmbed = new MessageEmbed()
		.setTitle(`${bot.config.emojis.success} | Ban Command`)
		.setDescription(`${bot.config.emojis.success} | Successfully Banned <@${UserToBan.id}>(${UserToBan.id})!`)
		.setThumbnail(message.author.displayAvatarURL({ dynamic: true, format: "gif" }))
		.addField(`Moderator/Admin: `, `${message.author.tag}`)
		.addField(`Reason: `, ReasonForBan)
		.setFooter({
			text: `${bot.config.prefix}Kick to kick a user. • ${bot.config.embed.footer}`,
			iconURL: bot.user.displayAvatarURL({ dynamic: true })
		})
		.setColor(bot.config.embed.color)
		.setTimestamp();

	await message.replyT({
		embeds: [BanEmbed],
	});
}

module.exports = new cmd(execute, {
	description: `Is a user bothering you and keep coming back after you kick them? Using this command, they won\'t come back unless they are unbanned.`,
	dirname: __dirname,
	usage: `<user> <optional reason>`,
	aliases: [`pban`],
	perms: ["BAN_MEMBERS"],
});
