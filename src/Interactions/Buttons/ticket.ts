import Discord, { Channel, Guild, GuildBasedChannel, Role, TextBasedChannel } from "discord.js";

async function GetTicketOpen(bot: any, member: any) {
	const ticket = await member.guild.channels.cache.filter((c: any) => c.name.includes("ticket") && !c.name.includes("closed") && c.topic.includes(member.user.tag)).map((c: GuildBasedChannel) => c);

	return ticket;
}

export default {
	async execute(bot: any, interaction: any) { // i made you some prank lmao, good luck
		if (interaction.customId === "ticket_create") {
			await interaction.deferReply({
				ephemeral: true
			});

			const guild = await bot.database.getGuild(interaction.guild.id);

			const allChannels = await interaction.guild.channels.cache.filter((c: GuildBasedChannel) => c.name.includes("ticket")).map((c: GuildBasedChannel) => c);
			const already = await interaction.guild.channels.cache.some((c: any) => (c.name ?? "unknown").includes("ticket") && !(c.name ?? "unknown").includes("closed") && (c.topic ?? "unknown").includes(interaction.member.user.tag));
			if (already === true) return await interaction.followUp(`You already have a ticket open in ${await GetTicketOpen(bot, interaction.member)}`);

			let category;

			try {
				category = await interaction.guild.channels.cache.find((c: GuildBasedChannel) => c.id === guild.tickets.category && c.type === "GUILD_CATEGORY") || await interaction.guild.channels.create("Tickets", {
					type: "GUILD_CATEGORY"
				});
			} catch (err: any) {
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
				guild.tickets.roles.forEach((role: Role) => {
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

			const supportEmbed = new Discord.MessageEmbed()
				.setTitle(`Support Awaits!`)
				.setDescription(`Support will be with you shortly.\n\nTicket Creator: ${interaction.member.user}`)
				.setFooter({
					text: "To close this ticket tap the 🔒 below.",
					iconURL: bot.user.displayAvatarURL()
				})
				.setColor("BLUE")
				.setTimestamp();

			const lockButton = new Discord.MessageButton()
				.setEmoji("🔒")
				.setStyle("SECONDARY")
				.setCustomId(`ticket_close_${interaction.channel.id}`);

			ticketChannel.send({
				embeds: [supportEmbed],
				components: [
					new Discord.MessageActionRow().addComponents(lockButton)
				]
			});

			interaction.followUp(`Your ticket has been created. ${ticketChannel}`);
		} else if (interaction.customId.startsWith(`ticket_close`)) {
			const closedEmbed = new Discord.MessageEmbed()
				.setColor("#ffffff")
				.setDescription(
					`Ticket closed by ${interaction.user}\n🔓 Reopen Ticket\n📛 Delete Ticket`
				);

			const reopen = new Discord.MessageButton()
				.setLabel("")
				.setCustomId(`ticket_reopen_${interaction.channel.id}`)
				.setEmoji("🔓")
				.setStyle("SUCCESS");

			const deleteinteraction = new Discord.MessageButton()
				.setLabel("")
				.setCustomId(`ticket_delete_${interaction.channel.id}`)
				.setEmoji("📛")
				.setStyle("DANGER");

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
				.catch((): any => { });

			interaction.reply({
				embeds: [closedEmbed],
				components: [
					new Discord.MessageActionRow().addComponents(reopen, deleteinteraction)
				]
			}).catch((): any => { });
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
			const deleteEmbed = new Discord.MessageEmbed()
				.setColor("#ffffff")
				.setDescription("Ticket will be deleted in 5 seconds.");

			interaction.reply({
				embeds: [deleteEmbed]
			});

			try {
				setTimeout(() => interaction.channel.delete().catch((): any => { }), 5000);
			} catch (err: any) {
				console.log("Attempted to delete a channel that didn't exist.");
			}
		}
	}
};
