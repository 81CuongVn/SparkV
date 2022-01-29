const Discord = require(`discord.js`);
const Weather = require(`weather-js`);

const cmd = require("../../templates/command");

module.exports = new cmd(async (bot, message, args, command, data) => {
	if (!args) return await message.replyT(`${bot.config.emojis.error} | Please specify a location!`);

	args = args.join(` `);

	Weather.find({
		search: args,
		degreeType: `F`,
	},
	async (error, result) => {
		if (error) return await message.replyT(error);
		if (result === undefined || result.length === 0) return await message.replyT(`${bot.config.emojis.error} | Invalid location!`);

		const Current = result[0].current;
		const Location = result[0].location;

		const WeatherInformation = new Discord.MessageEmbed()
			.setTitle(`${Current.observationpoint}'s Weather Forecast`)
			.setDescription(`Weather forecast for ${Current.observationpoint}`)
			.setThumbnail(Current.imageUrl)
			.addField(`**Tempature**`, `${Current.temperature}°F`, true)
			.addField(`**Wind**`, Current.winddisplay, true)
			.addField(`**Feels Like**`, `${Current.temperature}°F`, true)
			.addField(`**Humidity**`, `${Current.humidity}%`, true)
			.addField(`**Timezone**`, `${Location.timezone} UTC`, true)
			.setFooter({
				text: `Weather forecast for ${Current.observationpoint} • ${bot.config.embed.footer}`,
				iconURL: bot.user.displayAvatarURL({ dynamic: true })
			})
			.setColor(bot.config.embed.color)
			.setTimestamp();

		await message.replyT({
			embeds: [WeatherInformation],
		});
	},
	);
}, {
	description: `Checks for todays weather forcast in the location specified.`,
	aliases: [],
	usage: `(contry)`,
	bot_permissions: [`SEND_MESSAGES`, `EMBED_LINKS`, `VIEW_CHANNEL`, `ADD_REACTIONS`],
	member_permissions: [],
	cooldown: 5,
});
