const Discord = require("discord.js");

const cmd = require("@templates/modCommand");

async function execute(bot, message, args, command, data) {
	const reason = (message?.applicationId ? data.options.getString("reason") : args.join(" ")) || "No reason provided.";
	const embed = new Discord.MessageEmbed()
		.setAuthor({
			name: (message?.user ? message.user : message.author).tag,
			iconURL: (message?.user ? message.user : message.author).displayAvatarURL({ dynamic: true })
		})
		.setDescription(`This channel has been locked. Reason: ${reason}`)
		.setFooter({
			text: bot.config.embed.footer,
			iconURL: bot.user.displayAvatarURL({ dynamic: true })
		})
		.setColor("RED");

	try {
		await message.guild.roles.cache.forEach(role => message.channel.permissionOverwrites.create(role, { SEND_MESSAGES: false }));

		return await message.replyT({
			embeds: [embed]
		});
	} catch (err) {
		bot.logger(err, "error");

		message.replyT(`${bot.config.emojis.error} | Failed to lock channel. Please make sure I have the correct permissions.`);
	}
}

module.exports = new cmd(execute, {
	description: "I'll lock the current channel.",
	dirname: __dirname,
	aliases: [],
	usage: "",
	perms: ["MANAGE_CHANNELS"],
	bot_perms: ["MANAGE_CHANNELS"],
	slash: true,
	options: [
		{
			type: 3,
			name: "reason",
			description: "Reason for locking the server.",
		},
	]
});
