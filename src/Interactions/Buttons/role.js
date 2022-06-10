const Discord = require("discord.js");

module.exports = {
	async execute(bot, interaction) {
		await interaction.deferReply({
			ephemeral: true
		});

		const roleID = interaction.customId.slice(5);
		const role = await interaction.guild.roles.cache.get(roleID) || await interaction.guild.roles.fetch(roleID);

		if (!interaction?.member?.roles?.cache?.get(roleID)) {
			try {
				await interaction?.member?.roles?.add(roleID);
				interaction.followUp(`The role <@&${roleID}> was successfully added to you!`);
			} catch (err) {
				interaction.followUp(`${bot.config.emojis.error} | An error occurred while trying to add the role <@&${roleID}> to you. Please check my permissions and try again later.`);
			}
		} else {
			try {
				await interaction.member.roles.remove(roleID);

				interaction.followUp(`The role <@&${roleID}> was successfully removed from you.`);
			} catch (err) {
				interaction.followUp(`${bot.config.emojis.error} | An error occurred while trying to remove the role <@&${roleID}> from you. Please check my permissions and try again later.`);
			}
		}
	}
};
