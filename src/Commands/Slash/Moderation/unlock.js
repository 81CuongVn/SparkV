import Discord from "discord.js";

const cmd = require("@structures/modCommand");

async function execute(bot: any, message: any, args: string[], command: any, data: any) {
	const embed = new Discord.MessageEmbed()
		.setAuthor({
			name: (message?.user ? message.user : message.author).tag,
			iconURL: (message?.user ? message.user : message.author).displayAvatarURL({ dynamic: true })
		})
		.setDescription(`This channel has been unlocked!`)
		.setFooter({
			text: bot.config.embed.footer,
			iconURL: bot.user.displayAvatarURL({ dynamic: true })
		})
		.setColor("GREEN");

	try {
		await message.guild.roles.cache.forEach(role => message.channel.permissionOverwrites.create(role, { SEND_MESSAGES: true }));

		return await message.replyT({
			embeds: [embed]
		});
	} catch (err) {
		message.replyT(`${bot.config.emojis.error} | Failed to unlock channel. Please make sure I have the correct permissions.`);
	}
}

export default new cmd(execute, {
	description: "I'll unlock the current channel.",
	dirname: __dirname,
	aliases: ["ulock"],
	usage: "",
	perms: ["MANAGE_CHANNELS"],
	bot_perms: ["MANAGE_CHANNELS"],
	slash: true
});
