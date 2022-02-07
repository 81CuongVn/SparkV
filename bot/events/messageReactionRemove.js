const Discord = require("discord.js");

module.exports = {
	once: false,
	async execute(bot, reaction, user) {
		if (reaction?.partial) await reaction?.fetch();
		if (reaction.message?.partial) await reaction?.message.fetch();

		const message = reaction.message;

		if (reaction.emoji.name !== "⭐" || reaction.count < 2) return;

		const data = await bot.database.getGuild(message.guildId);

		if (data.plugins?.starboard?.enabled === false) return;

		const channel = message.guild.channels.cache.find(c => c.id === data.plugins.starboard?.channel);

		if (!channel) return;

		const fetchedMessages = await channel.messages.fetch({ limit: 100 });
		const stars = fetchedMessages.find(m => m.embeds[0].footer.text.startsWith("⭐") && m.embeds[0].footer.text.endsWith(message.id));

		if (stars) {
			const star = /^\⭐\s([0-9]{1,3})\s\|\s([0-9]{17,20})/.exec(stars.embeds[0].footer.text);
			const foundStar = stars.embeds[0];

			const embed = new Discord.MessageEmbed()
				.setAuthor({
					name: message.author.tag,
					iconURL: message.author.displayAvatarURL({ dynamic: true })
				})
				.setImage(message.attachments.first()?.url || null)
				.addField("Source", `[Jump to Message!](${message.url})`, true)
				.setFooter({
					text: `⭐ ${parseInt(star[1]) + 1} | ${message.id}`
				})
				.setColor(foundStar.color)
				.setTimestamp();

			if (foundStar?.description) {
				embed.setDescription(foundStar.description);
			}

			const starMsg = await channel.messages.fetch(stars.id);

			try {
				await starMsg.edit({ content: `⭐ **${parseInt(star[1]) - 1}** ${message.channel}`, embeds: [embed] });
			} catch (err) {
				// Most likely the message was created by a different bot with a Starboard system. Let's try and repost and then delete the old one.

				await channel.send({ content: `⭐ **${parseInt(star[1]) - 1}** ${message.channel}`, embeds: [embed] });
				await starMsg.delete().catch(() => {});
			}

			if (parseInt(star[1] - 1) === 0) return setTimeout(() => starMsg.delete(), 3 * 1000);
		}
	},
};
