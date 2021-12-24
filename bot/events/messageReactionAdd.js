const Discord = require("discord.js");

async function extension(reaction, attachment) {
	const imageLink = attachment.split(".");
	const typeOfImage = imageLink[imageLink.length - 1];

	if (!/(jpg|jpeg|png|gif)/gi.test(typeOfImage)) return "";

	return attachment;
}

module.exports = {
	once: false,
	async execute(bot, reaction, user) {
		const message = reaction.message;

		if (message.author.bot) return;

		if (reaction.emoji.name === "⭐") {
			const data = bot.database.getGuild(message.guild.id);

			if (data.plugins.starboard) {
				const channel = message.guild.channels.cache.find(c => c.id === data.plugins.starboard);

				if (!channel) return;

				const fetchedMessages = await channel.messages.fetch({ limit: 100 });
				const stars = fetchedMessages.find(m => m.embeds[0].footer.text.startsWith("⭐") && m.embeds[0].footer.text.endsWith(message.id));

				if (stars) {
					const star = /^\⭐\s([0-9]{1,3})\s\|\s([0-9]{17,20})/.exec(stars.embeds[0].footer.text);
					const foundStar = stars.embeds[0];
					const image = message.attachments.size > 0 ? await extension(reaction, message.attachments.array()[0].url) : "";
					const msg = await channel.messages.fetch(stars.id);

					const embed = new MessageEmbed()
						.setDescription(foundStar.description)
						.setAuthor({
							name: message.author.tag,
							iconURL: message.author.displayAvatarURL
						})
						.setImage(image)
						.setFooter(`⭐ ${parseInt(star[1]) + 1} | ${message.id}`)
						.setColor(foundStar.color)
						.setTimestamp();

					const starMsg = await channel.messages.fetch(stars.id);
					await msg.edit({ embeds: [embed] });
				} else {
					const image = message.attachments.size > 0 ? await extension(reaction, message.attachments.array()[0].url) : "";

					if (image === "" && message.cleanContent.length < 1) return message.replyT(`${user}, You cannot star an empty message.`);

					const embed = new MessageEmbed()
						.setDescription(message.cleanContent)
						.setAuthor({
							name: message.author.tag,
							iconURL: message.author.displayAvatarURL
						})
						.setImage(image)
						.setFooter(`⭐ 1 | ${message.id}`)
						.setColor(15844367)
						.setTimestamp();

					await channel.send({ embeds: [embed] });
				}
			}
		}
	},
};
