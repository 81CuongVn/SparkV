const Discord = require(`discord.js`);
const urban = require(`urban`);

const cmd = require("../../templates/command");

async function execute(bot, message, args, command, data) {
	if (!args) {
		const ErrorEmbed = new Discord.MessageEmbed()
			.setTitle(`${bot.config.emojis.error} | Invalid command usage!`)
			.setDescription(`Please provide a word to urban!`)
			.setFooter({
				text: `Try ^Urban [Word] • ${bot.config.embed.footer}`,
				iconURL: bot.user.displayAvatarURL({ dynamic: true })
			});

		return await await message.replyT({
			embeds: [ErrorEmbed],
		});
	}

	args = await urban(args.join(" "));
	console.log(args);

	const UrbanEmbed = new Discord.MessageEmbed()
		.setTitle(`${bot.config.emojis.success} | Definition of ${args}`)
		.setDescription(args.definition)
		.setThumbnail(`https://i.imgur.com/VFXr0ID.jpg`)
		.addField(`Example`, args.example)
		.setURL(args.permalink)
		.setFooter({
			text: `👍${args.thumbs_up} 👎${args.thumbs_down} | 😃${args.author} • ${bot.config.embed.footer}`,
			iconURL: bot.user.displayAvatarURL({ dynamic: true })
		})
		.setColor(bot.config.embed.color);

	return await await message.replyT({
		embeds: [UrbanEmbed],
	});
}

module.exports = new cmd(execute, {
	description: `I will return an urban dictionary definition of a word! Due to recent API failures, this command is disabled to provide you a better experience.`,
	aliases: [],
	dirname: __dirname,
	usage: `<word>`,
	enabled: false
});
