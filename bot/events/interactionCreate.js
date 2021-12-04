const logger = require("../../modules/logger");

module.exports = {
	once: false,
	async execute(bot, interaction) {
		if (interaction.isCommand()) {
			// Get the command
			const command = bot.commands.get(interaction.commandName);

			if (!command) return;

			const data = {};

			// Get the Guild
			if (interaction.inGuild()) {
				const guild = await bot.database.getGuild(interaction.guild.id);

				data.guild = guild;
				interaction.guild.data = data.guild;
			}

			if (interaction.guild) data.member = await bot.database.getMember(interaction.user.id, interaction.guild.id);

			// User data
			data.user = await bot.database.getUser(interaction.user.id);

			if (!data) return;

			// Get the command's args
			const args = [];

			if (!command.settings.options) {
				command.settings.options = [];
			}

			for (const arg of command.settings.options) {
				const gotArg = await interaction.options.get(arg.name);

				if (gotArg) {
					args.push([
						[arg.name] = gotArg.value
					]);
				}
			}

			bot.StatClient.postCommand(command.settings.name, interaction.user.id);

			try {
				await command.run(bot, interaction, args, interaction.commandName, data);
			} catch (error) {
				console.error(error);

				await interaction.reply({
					content: "❌ | There was an error while executing this command!",
					ephemeral: true,
				});
			}
		}
	},
};
