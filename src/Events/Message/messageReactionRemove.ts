import Discord from "discord.js";

export default {
	once: false,
	async execute(bot: any, reaction: any, user: any) {
		if (reaction?.partial) await reaction?.fetch().catch((): any => { });
		if (reaction.message?.partial) await reaction?.message.fetch().catch((): any => { });

		const message = reaction.message;

		const data = await bot.database.getGuild(message.guildId);

		if (data.starboard?.enabled === "true") {
			if (!(reaction.emoji.name === (data.starboard?.emoji || "⭐"))) return;

			const channel = message.guild.channels.cache.find((c: Discord.TextBasedChannel) => c.id === data.starboard?.channel);
			if (!channel) return;

			let fetchedMessages = await channel.messages.fetch({ limit: 100 });
			fetchedMessages = fetchedMessages.filter((m: Discord.Message) => {
				if (m?.embeds?.length > 0) return true;
				else return false;
			});

			const stars = fetchedMessages.find((m: Discord.Message) => m.embeds[0]?.description?.includes(message.url));
			if (stars) {
				const foundStar = stars.embeds[0];
				const embed = new Discord.EmbedBuilder()
					.setAuthor({
						name: message.author.tag,
						iconURL: message.author.displayAvatarURL()
					})
					.setDescription(`[${message.channel.name}](${message.url}) | ${data.starboard?.emoji} **${reaction.count}**${foundStar?.description.includes("\n\n") ? `\n\n${foundStar?.description.split(`\n\n`)[1]}` : ""}`)
					.setImage(message.attachments.first()?.url || null)
					.setColor(foundStar.color)
					.setTimestamp();

				const starMsg = await channel.messages.fetch(stars.id);
				try {
					await starMsg.edit({
						embeds: [embed]
					});
				} catch (err: any) {
					// Most likely the message was created by a different bot with a Starboard system. Let's try and repost and then delete the old one.

					await channel.send({
						embeds: [embed]
					});

					await starMsg.delete().catch((): any => { });
				}

				if (reaction.count === 0) return setTimeout(() => starMsg.delete(), 3 * 1000);
			}
		}
	},
};
