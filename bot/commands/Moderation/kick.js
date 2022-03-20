const Discord = require(`discord.js`);

const cmd = require("../../templates/modCommand");

async function execute(bot, message, args, command, data) {
	const user = data.options.getMember("user");
	const reason = data.options.getString("reason");

	if (user.user.id === message.user.id) return message.replyT(`${bot.config.emojis.error} | You cannot kick yourself.`);
	if (!user.kickable) return message.replyT(`${bot.config.emojis.error} | Uh oh... I can't kick this user!`);

	user.send(`${bot.config.emojis.warning} | You have been kicked from ${message.guild.name}! Reason: ${reason}.`).catch(err => {});
	user.kick().catch(async err => await message.replyT(`${bot.config.emojis.error} | Failed to kick. Please check my permisions and try again.`));

	const KickEmbend = new Discord.MessageEmbed()
		.setTitle("Kick Command")
		.setDescription(`${bot.config.emojis.success} | Successfully kicked ${user} (${user.id})!`)
		.setThumbnail(user.avatar)
		.addField(`Moderator/Admin: `, `${message.user.tag}`)
		.addField(`Reason: `, reason)
		.setFooter({
			text: `${bot.config.prefix}Ban to ban a user. • ${bot.config.embed.footer}`,
			iconURL: bot.user.displayAvatarURL({ dynamic: true })
		})
		.setColor(bot.config.embed.color)
		.setTimestamp();

	await message.replyT(KickEmbend);
}

module.exports = new cmd(execute, {
	description: `Is a user bothering you? Using this command, you can kick them from the server!`,
	dirname: __dirname,
	aliases: [],
	usage: `(user) (reason)`,
	perms: ["KICK_MEMBERS"],
	slash: true,
	slashOnly: true,
	options: [
		{
			type: 6,
			name: "user",
			description: "The user to kick.",
			required: true
		},
		{
			type: 3,
			name: "reason",
			description: "The reason for kicking the user."
		}
	]
});
