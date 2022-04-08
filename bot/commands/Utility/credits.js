const Discord = require(`discord.js`);

const cmd = require("@templates/command");

module.exports = new cmd(
	async (bot, message) => {
		const Credits = [
			{
				name: await message.translate("**🛠 | Developers**"),
				value: "The people who made SparkV!\n\n**KingCh1ll** - Head Developer\n**Qu1ckly_Frost** - Developer",
				inline: true,
			},
			{
				name: await message.translate("**✨ | Contributors**"),
				value: `${await message.translate("People that have contributed to ")}SparkV.\n\n**2Lost4Discord** - ${await message.translate("Getting the bot verified.")}`,
				inline: true,
			},
		];

		const NewEmbed = new Discord.MessageEmbed()
			.setTitle(await message.translate("Credits"))
			.setDescription(await message.translate(`Here's the list of people who've helped SparkV on his path to success!`))
			.setColor(bot.config.embed.color)
			.setThumbnail(message.user.displayAvatarURL({ dynamic: true, format: "gif" }))
			.addFields(Credits);

		return await message.replyT({
			embeds: [NewEmbed]
		});
	},
	{
		description: `Look at everyone who helped make SparkV!`,
		dirname: __dirname,
		usage: "",
		aliases: ["devs", "developers"],
		perms: [],
		slash: true
	},
);
