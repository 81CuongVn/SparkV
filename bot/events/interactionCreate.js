const logger = require("../../modules/logger");
const Discord = require("discord.js");

const cooldowns = [];

module.exports = {
	once: false,
	async execute(bot, interaction) {
		if (interaction.isCommand()) {
			await interaction.deferReply();

			// Get the command
			const command = bot.commands.get(interaction.commandName);

			if (!command) return;

			// Cooldown System
			if (!cooldowns[interaction.user.id]) cooldowns[interaction.user.id] = [];

			const userCooldown = cooldowns[interaction.user.id];
			const time = userCooldown[command.settings.name] || 0;

			if (time && (time > Date.now())) {
				const cooldownEmbed = new Discord.MessageEmbed()
					.setTitle(`${bot.config.emojis.error} | Whoa there ${interaction.user.username}!`)
					.setDescription(`Please wait ${Math.ceil((time - Date.now()) / 1000)} more seconds to use that command again.`)
					.setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
					.setColor(`#0099ff`)
					.setFooter({
						text: bot.config.embed.footer,
						iconURL: bot.user.displayAvatarURL()
					});

				return await interaction.replyT({
					embeds: [cooldownEmbed],
				});
			}

			cooldowns[interaction.user.id][command.settings.name] = Date.now() + command.settings.cooldown;

			const data = {};

			// Get the Guild
			if (interaction.inGuild()) {
				const guild = await bot.database.getGuild(interaction.guild.id);

				data.guild = guild;
				data.member = await bot.database.getMember(interaction.user.id, interaction.guild.id);

				interaction.guild.data = data.guild;
			}

			// User data
			data.user = await bot.database.getUser(interaction.user.id);

			// Data Old Options
			data.options = interaction.options;

			if (!data) return;

			// Get the command's args
			const args = [];

			if (!command.settings.options) command.settings.options = [];

			// For (const arg of command.settings.options) {
			// 	const gotArg = await interaction.options.get(arg.name);

			// 	if (gotArg) {
			// 		args.push([
			// 			[arg.name] = gotArg.value
			// 		]);
			// 	}
			// }

			if (command.settings.enabled === false) return await interaction.replyT(`${bot.config.emojis.error} | This command is currently disabled! Please try again later.`);
			if (command.settings.guildOnly && !interaction.guild) return await interaction.replyT("This command is guild only. Please join a server with SparkV in it or invite SparkV to your own server.",);
			if (command.settings.ownerOnly && interaction.user.id !== bot.user.ownerID) return await interaction.replyT("This command is restricted. Only the owner (KingCh1ll) can use this command.");

			bot.StatClient.postCommand(command.settings.name, interaction.user.id);

			try {
				await command.run(bot, interaction, args, interaction.commandName, data);
			} catch (error) {
				console.error(error);

				const ErrorEmbed = new Discord.MessageEmbed()
					.setAuthor({
						name: interaction.user.tag,
						iconURL: interaction.user.displayAvatarURL({ dynamic: true })
					})
					.setTitle("Uh oh!")
					.setDescription(`**An error occured while trying to run this command. Please contact support [here](https://discord.gg/PPtzT8Mu3h).**\n\n${error.message}`)
					.addField("**Error**", `\`\`\`${error.message}\`\`\``)
					.setColor("RED");

				await interaction.followUp({
					embeds: [ErrorEmbed],
					ephemeral: true,
				});
			}
		}
	},
};
