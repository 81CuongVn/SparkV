const Discord = require("discord.js");

const cmd = require("../../templates/modCommand");

async function execute(bot, message, args, command, data) {
	const User = message.mentions.members.first() || message.author;

	if (!User) return await message.replyT(`${bot.config.emojis.error} | Please mention someone to view their warnings!`);

	if (!data.member.infractionsCount === 0) return await message.replyT("This user doesn't have any infractions!");

	if (data.member.infractionsCount >= 25) return await message.replyT("This user has too many infractions!");

	const infractions = data.member.infractions.map(infraction => `**${infraction.type}** - <t:${~~(infraction.date / 1000)}:R>\n`);

	const warningsEmbed = new Discord.MessageEmbed()
		.setTitle(`${user.user ? user.user.tag : user.tag}'s infractions`)
		.setDescription(`${User} has **${data.member.infractionsCount}** warning${data.member.infractionsCount > 1 ? "s" : ""}.\n\n${infractions}`)
		.setFooter(bot.config.embed.footer, user.user ? user.user.displayAvatarURL({ dynamic: true, format: "png" }) : user.displayAvatarURL({ dynamic: true, format: "png" }))
		.setColor(bot.config.embed.color);

	await message.replyT({
		embeds: [warningsEmbed],
	});
}

module.exports = new cmd(execute, {
	description: `I'll display a user's warnings.`,
	dirname: __dirname,
	aliases: ["infractions"],
	usage: `<user>`,
	perms: ["KICK_MEMBERS"],
});
