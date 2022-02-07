const Discord = require("discord.js");

const cmd = require("../../templates/command");

async function execute(bot, message, args, command, data) {
	const noblox = require("noblox.js");

	try {
		const UserID = await noblox.getIdFromUsername(args[0]);

		if (!UserID) return await message.replyT(`User lookup canceled. User doesn't exist.`);

		await noblox.getPlayerInfo(UserID).then(async PlayerInfo => {
			const InfoEmbed = new Discord.MessageEmbed()
				.setTitle(`${PlayerInfo.username}'s Profile`)
				.setDescription(`*${PlayerInfo.status || "No status."}*`)
				.addField(`**Account Age**`, `${PlayerInfo.age || "N/A"} days old (${PlayerInfo.joinDate || "N/A"})`)
				.addField(`**Description**`, PlayerInfo.blurb || "N/A")
				.setThumbnail(
					`https://www.roblox.com/headshot-thumbnail/image?userId=${UserID}&width=420&height=420&format=png`,
				)
				.setURL(`https://www.roblox.com/users/${UserID}/profile`)
				.setFooter({
					text: `Username: ${PlayerInfo.username} | UserID: ${UserID} • ${bot.config.embed.footer}`
				})
				.setColor(bot.config.embed.color);

			await message.replyT({
				embeds: [InfoEmbed],
			});
		});
	} catch (err) {
		const ErrorEmbed = new Discord.MessageEmbed()
			.setTitle(`404 | User Not Found`)
			.setDescription(
				"Uh oh! Looks like this user doesn't exist or roblox is down. Check [Roblox Status](https://status.roblox.com/).",
			)
			.setFooter({
				text: `User not found • ${bot.config.embed.footer}`
			})
			.setThumbnail(
				"https://media.discordapp.net/files/539579135786352652/641188940983959555/627171202464743434.png",
			)
			.setColor(bot.config.embed.color)
			.setTimestamp();

		await message.replyT({
			embeds: [ErrorEmbed],
		});
	}
}

module.exports = new cmd(execute, {
	description: "SparkV will look up any user and return information on that user.",
	dirname: __dirname,
	usage: "<username>",
	aliases: [],
	perms: ["EMBED_LINKS"],
});
