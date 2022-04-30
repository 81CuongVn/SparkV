const logger = require("@modules/logger");
const Discord = require("discord.js");

async function GetTicketOpen(bot, member) {
	const ticket = await member.guild.channels.cache.filter(c => c.name.includes("ticket") && !c.name.includes("closed") && c.topic.includes(member.user.tag)).map(c => c);

	return ticket;
}

const cooldowns = [];

module.exports = {
	once: false,
	async execute(bot, interaction) {
		if (interaction.isCommand()) {
			// Get the command
			const command = bot.commands.get(interaction.commandName);

			if (!command) return;

			try {
				if (interaction) {
					await interaction.deferReply({
						ephemeral: command.settings.ephemeral || false
					});
				} else {
					return;
				}
			} catch (err) {
				return;
			}

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

			// Cooldown System
			if (!cooldowns[interaction.user.id]) cooldowns[interaction.user.id] = [];

			const userCooldown = cooldowns[interaction.user.id];
			const time = userCooldown[command.settings.name] || 0;

			if (time && (time > Date.now())) {
				const cooldownEmbed = new Discord.EmbedBuilder()
					.setAuthor({
						name: interaction.user.tag,
						iconURL: interaction.user.displayAvatarURL({ dynamic: true })
					})
					.setTitle(`${bot.config.emojis.error} | Whoa there ${interaction.user.username}!`)
					.setDescription(`Please wait **${((time - Date.now()) / 1000 % 60).toFixed(2)} **more seconds to use that command again.`)
					.setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
					.setColor("#ED4245")
					.setFooter({
						text: bot.config.embed.footer,
						iconURL: bot.user.displayAvatarURL()
					});

				return await interaction.replyT({
					embeds: [cooldownEmbed]
				});
			}

			cooldowns[interaction.user.id][command.settings.name] = Date.now() + command.settings.cooldown;

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
			if (command.settings.guildOnly && !interaction.guild) return await interaction.replyT("This command is guild only. Please join a server with SparkV in it or invite SparkV to your own server.");
			if (command.settings.ownerOnly && interaction.user.id !== bot.config.ownerID) return await interaction.replyT("This command is restricted. Only the owner (KingCh1ll) can use this command.");

			bot.StatClient.postCommand(command.settings.name, interaction.user.id);

			try {
				await command.run(bot, interaction, args, interaction.commandName, data);
			} catch (error) {
				bot.logger(error, "error");

				const ErrorEmbed = new Discord.EmbedBuilder()
					.setAuthor({
						name: interaction.user.tag,
						iconURL: interaction.user.displayAvatarURL({ dynamic: true })
					})
					.setTitle("Uh oh!")
					.setDescription(`**An error occured while trying to run this command. Please contact support [here](https://discord.gg/PPtzT8Mu3h).**\n\n${error.message}`)
					.addFields([
						{
							name: "**Error**",
							value: `\`\`\`${error.message}\`\`\``
						}
					])
					.setColor("#ED4245");

				await interaction.replyT({
					embeds: [ErrorEmbed],
					ephemeral: true
				});
			}
		} else if (interaction.isButton()) {
			if (interaction.customId.startsWith("ticket")) {
				if (interaction.customId === "ticket_create") {
					await interaction.deferReply({
						ephemeral: true
					});

					const guild = await bot.database.getGuild(interaction.guild.id);

					const allChannels = await interaction.guild.channels.cache.filter(c => c.name.includes("ticket")).map(c => c);
					const already = await interaction.guild.channels.cache.some(c => (c.name ?? "unknown").includes("ticket") && !(c.name ?? "unknown").includes("closed") && (c.topic ?? "unknown").includes(interaction.member.user.tag));

					if (already === true) return await interaction.followUp(`You already have a ticket open in ${await GetTicketOpen(bot, interaction.member)}`);

					let category;

					try {
						category = await interaction.guild.channels.cache.find(c => c.id === guild.tickets.category && c.type === "GUILD_CATEGORY") || await interaction.guild.channels.create("Tickets", {
							type: "GUILD_CATEGORY"
						});
					} catch (err) {
						return interaction.followUp(`${bot.config.emojis.error} | I couldn't create the ticket category. Please make sure I have the correct permissions.`);
					}

					const permissionOverwrites = [
						{
							id: bot.user.id,
							allow: ["SEND_MESSAGES", "VIEW_CHANNEL"]
						},
						{
							id: interaction.member.id,
							allow: ["SEND_MESSAGES", "VIEW_CHANNEL"]
						},
						{
							id: interaction.guild.roles.everyone,
							deny: ["VIEW_CHANNEL"]
						}
					];

					if (guild?.tickets?.roles.length > 0) {
						guild.tickets.roles.forEach(role => {
							permissionOverwrites.push({
								id: role,
								allow: ["SEND_MESSAGES", "VIEW_CHANNEL"]
							});
						});
					}

					const ticketChannel = await interaction.guild.channels.create(`ticket-${allChannels.length}`, {
						type: "text",
						topic: `${interaction.member.user.tag}'s Ticket | ${interaction.member.id}`,
						parent: category.id,
						permissionOverwrites
					});

					const supportEmbed = new Discord.EmbedBuilder()
						.setTitle(`Support Awaits!`)
						.setDescription(`Support will be with you shortly.\n\nTicket Creator: ${interaction.member.user}`)
						.setFooter({
							text: "To close this ticket tap the 🔒 below.",
							iconURL: bot.user.displayAvatarURL()
						})
						.setColor("BLUE")
						.setTimestamp();

					const lockButton = new Discord.ButtonBuilder()
						.setEmoji("🔒")
						.setStyle(bot.functions.getButtonStyle("SECONDARY"))
						.setCustomId(`ticket_close_${interaction.channel.id}`);

					ticketChannel.send({
						embeds: [supportEmbed],
						components: [
							new Discord.ActionRowBuilder().addComponents(lockButton)
						]
					});

					interaction.followUp(`Your ticket has been created. ${ticketChannel}`);
				} else if (interaction.customId.startsWith(`ticket_close`)) {
					const closedEmbed = new Discord.EmbedBuilder()
						.setColor("#ffffff")
						.setDescription(
							`Ticket closed by ${interaction.user}\n🔓 Reopen Ticket\n📛 Delete Ticket`
						);

					const reopen = new Discord.ButtonBuilder()
						.setLabel("")
						.setCustomId(`ticket_reopen_${interaction.channel.id}`)
						.setEmoji("🔓")
						.setStyle(bot.functions.getButtonStyle("SUCCESS"));

					const deleteinteraction = new Discord.ButtonBuilder()
						.setLabel("")
						.setCustomId(`ticket_delete_${interaction.channel.id}`)
						.setEmoji("📛")
						.setStyle(bot.functions.getButtonStyle("DANGER"));

					interaction.channel
						.edit({
							name: `${interaction.channel.name}-closed`,
							permissionOverwrites: [
								{
									id: bot.user.id,
									allow: ["SEND_MESSAGES", "VIEW_CHANNEL"]
								},
								{
									id: interaction.member.id,
									deny: ["SEND_MESSAGES", "VIEW_CHANNEL"]
								},
								{
									id: interaction.guild.roles.everyone,
									deny: ["VIEW_CHANNEL"]
								}
								// {
								// 	id: bot.config.services.support.roleID,
								// 	allow: ["SEND_MESSAGES", "VIEW_CHANNEL"],
								// },
							]
						})
						.catch(err => { });

					interaction.reply({
						embeds: [closedEmbed],
						components: [
							new Discord.ActionRowBuilder().addComponents(reopen, deleteinteraction)
						]
					}).catch(err => { });
				} else if (interaction.customId === `ticket_reopen_${interaction.channel.id}`) {
					const createdBy = interaction.channel.topic.replace("'s Ticket", "");
					console.log(interaction.channel.topic.split(" | ")[1]);

					interaction.channel.edit({
						name: interaction.channel.name.toString().replace("-closed", ""),
						permissionOverwrites: [
							{
								id: bot.user.id,
								allow: ["SEND_MESSAGES", "VIEW_CHANNEL"]
							},
							{
								id: interaction.channel.topic.split(" | ")[1],
								allow: ["SEND_MESSAGES", "VIEW_CHANNEL"]
							},
							{
								id: interaction.guild.roles.everyone,
								deny: ["VIEW_CHANNEL"]
							}
							// {
							// 	id: bot.config.services.support.roleID,
							// 	allow: ["SEND_MESSAGES", "VIEW_CHANNEL"],
							// },
						]
					});

					interaction.reply(`This ticket has been reopened. Welcome back!`);
				} else if (interaction.customId.startsWith("ticket_delete")) {
					const deleteEmbed = new Discord.EmbedBuilder()
						.setColor("#ffffff")
						.setDescription("Ticket will be deleted in 5 seconds.");

					interaction.reply({
						embeds: [deleteEmbed]
					});

					try {
						setTimeout(() => {
							interaction.channel.delete().catch(err => { });
						}, 5000);
					} catch (err) {
						console.log("Attempted to delete a channel that didn't exist.");
					}
				}
			} else if (interaction.customId.startsWith("role")) {
				await interaction.deferReply({
					ephemeral: true
				});

				const roleID = interaction.customId.slice(5);
				const role = await interaction.guild.roles.cache.get(roleID) || await interaction.guild.roles.fetch(roleID);

				if (!interaction.member.roles.cache.get(roleID)) {
					await interaction.member.roles.add(roleID);

					interaction.followUp(`The role <@&${roleID}> was successfully added to you!`);
				} else {
					await interaction.member.roles.remove(roleID);

					interaction.followUp(`The role <@&${roleID}> was successfully removed from you.`);
				}
			}
		}
	}
};
