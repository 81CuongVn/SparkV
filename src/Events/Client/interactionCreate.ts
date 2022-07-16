import Discord, { Colors, InteractionType } from "discord.js";
import fs from "fs";
import path from "path";

const cooldowns: any[] = [];

export default {
	once: false,
	async execute(bot: any, interaction: any) {
		if (interaction.type === InteractionType.ApplicationCommand) {
			const command = bot.commands.get(interaction.commandName);
			if (!command) return;

			try {
				if (interaction) {
					await interaction.deferReply({
						ephemeral: command.settings.ephemeral || false
					});
				} else { return; }
			} catch (err: any) { return; }

			const data = {} as { guild: any[], member: any[], user: any[], options: any[] };
			if (interaction.inGuild()) {
				data.guild = await bot.database.getGuild(interaction.guild.id);
				data.member = await bot.database.getMember(interaction.user.id, interaction.guild.id);
			}

			data.user = await bot.database.getUser(interaction.user.id);
			data.options = interaction.options;
			if (!data) return;

			// Cooldown System
			if (!cooldowns[interaction.user.id]) cooldowns[interaction.user.id] = [];
			const time = cooldowns[interaction.user.id][command.settings.name] || 0;
			if (time && (time > Date.now())) {
				const cooldownEmbed = new Discord.EmbedBuilder()
					.setAuthor({
						name: interaction.user.tag,
						iconURL: interaction.user.displayAvatarURL()
					})
					.setTitle(`${bot.config.emojis.error} | Whoa there ${interaction.user.username}!`)
					.setDescription(`Please wait **${((time - Date.now()) / 1000 % 60).toFixed(2)} **more seconds to use that command again.`)
					.setThumbnail(interaction.user.displayAvatarURL())
					.setColor(Colors.Red)
					.setFooter({
						text: bot.config.embed.footer,
						iconURL: bot.user.displayAvatarURL()
					});

				return await interaction.replyT({
					embeds: [cooldownEmbed]
				});
			}

			cooldowns[interaction.user.id][command.settings.name] = Date.now() + command.settings.cooldown;

			if (!command.settings.options) command.settings.options = [];
			if (command.settings.enabled === false) return await interaction.replyT(`${bot.config.emojis.error} | This command is currently disabled! Please try again later.`);
			if (command.settings.guildOnly && !interaction.guild) return await interaction.replyT("This command is guild only. Please join a server with SparkV in it or invite SparkV to your own server.");
			if (command.settings.ownerOnly && !bot.config.owners.includes(interaction.user.id)) return await interaction.replyT("This command is restricted. Only the owners (KingCh1ll, Unbreakablenight) can use this command.");

			bot.StatClient.postCommand(command.settings.name, interaction.user.id, process.argv.includes("--sharding") === true && bot);

			try {
				await command.run(bot, interaction, [], interaction.commandName, data);
			} catch (error: any) {
				bot.logger(error, "error");

				const ErrorEmbed = new Discord.EmbedBuilder()
					.setAuthor({
						name: interaction.user.tag,
						iconURL: interaction.user.displayAvatarURL()
					})
					.setTitle("Uh oh!")
					.setDescription(`**An error occured while trying to run this command. Please contact support [here](https://discord.gg/PPtzT8Mu3h).**\n\n${error.message}`)
					.addFields([ { name: "**Error**", value: `\`\`\`${error.message}\`\`\``, inline: true } ])
					.setColor(Colors.Red);

				await interaction.replyT({
					embeds: [ErrorEmbed],
					ephemeral: true
				});
			}
		} else if (interaction.isButton()) {
			for (const file of fs.readdirSync(`${process.env.MainDir}/Interactions/Buttons`)) {
				if (interaction.customId.startsWith(file.split(".")[0]) || interaction.customId.includes(file.split(".")[0])) {
					const event = (await import(path.resolve(`${process.env.MainDir}/Interactions/Buttons/${file}`))).default;
					event.execute(bot, interaction);
				}
			}
		}
	}
};
