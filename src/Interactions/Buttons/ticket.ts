import { ButtonStyle, Channel, Colors, Guild, GuildBasedChannel, Role, TextBasedChannel } from "discord.js";

async function GetTicketOpen(bot: any, member: any) {
	const ticket = await member.guild.channels.cache.filter((c: any) => c.name.includes("ticket") && !c.name.includes("closed") && c.topic.includes(member.user.tag)).map((c: GuildBasedChannel) => c);

	return ticket;
}

export default {
	async execute(bot: any, interaction: any) {
		switch (interaction.customId) {
			case "ticket_create": {
				await interaction.deferReply({ ephemeral: true });

				const guild = await bot.database.getGuild(interaction.guild.id);

				const allChannels = await interaction.guild.channels.cache.filter((c: GuildBasedChannel) => c.name.includes("ticket")).map((c: GuildBasedChannel) => c);
				const already = await interaction.guild.channels.cache.some((c: any) => (c.name ?? "unknown").includes("ticket") && !(c.name ?? "unknown").includes("closed") && (c.topic ?? "unknown").includes(interaction.member.user.tag));
				if (already === true) return await interaction.followUp(`You already have a ticket open in ${await GetTicketOpen(bot, interaction.member)}`);

				let category;
				try {
					category = await interaction.guild.channels.cache.find((c: any) => c.id === guild.tickets.category && c.type === "GUILD_CATEGORY") || await interaction.guild.channels.create("Tickets", {
						type: "GUILD_CATEGORY"
					});
				} catch (err: any) {
					return interaction.followUp(`${bot.config.emojis.error} | I couldn't create the ticket category. Please make sure I have the correct permissions.`);
				}

				const permissionOverwrites = [{
					id: bot.user.id,
					allow: ["SEND_MESSAGES", "VIEW_CHANNEL"]
				}, {
					id: interaction.member.id,
					allow: ["SEND_MESSAGES", "VIEW_CHANNEL"]
				}, {
					id: interaction.guild.roles.everyone,
					deny: ["VIEW_CHANNEL"]
				}];

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

				ticketChannel.send({
					embeds: [{
						title: "Support Awaits!",
						description: `Support will be with you shortly.\n\nTicket Creator: ${interaction.member.user}`,
						footer: {
							text: "To close this ticket tap the 🔒 below.",
							icon_url: bot.user.displayAvatarURL()
						},
						color: "BLUE",
						timestamp: new Date()
					}],
					components: [{
						type: 1,
						components: [{
							type: 2,
							emoji: "🔒",
							style: 2,
							customId: `ticket_close_${interaction.channel.id}`
						}]
					}]
				});

				interaction.followUp(`Your ticket has been created. ${ticketChannel}`);
				break;
			} case "ticket_close": {
				interaction.channel.edit({
					name: `${interaction.channel.name}-closed`,
					permissionOverwrites: [{
						id: bot.user.id,
						allow: ["SEND_MESSAGES", "VIEW_CHANNEL"]
					}, {
						id: interaction.member.id,
						deny: ["SEND_MESSAGES", "VIEW_CHANNEL"]
					}, {
						id: interaction.guild.roles.everyone,
						deny: ["VIEW_CHANNEL"]
					}]
				}).catch((): any => { });

				interaction.reply({
					embeds: [{
						description: `Ticket closed by ${interaction.user}\n🔓 Reopen Ticket\n📛 Delete Ticket`,
						color: Colors.Yellow
					}],
					components: [{
						type: 1,
						components: [{
							emoji: "🔓",
							customId: `ticket_reopen`,
							style: ButtonStyle.Success
						}, {
							emoji: "📛",
							customId: `ticket_delete`,
							style: ButtonStyle.Danger
						}]
					}]
				}).catch((): any => { });
				break;
			} case "ticket_reopen": {
				interaction.channel.edit({
					name: interaction.channel.name.toString().replace("-closed", ""),
					permissionOverwrites: [{
						id: bot.user.id,
						allow: ["SEND_MESSAGES", "VIEW_CHANNEL"]
					}, {
						id: interaction.channel.topic.split(" | ")[1],
						allow: ["SEND_MESSAGES", "VIEW_CHANNEL"]
					}, {
						id: interaction.guild.roles.everyone,
						deny: ["VIEW_CHANNEL"]
					}]
				});

				interaction.reply(`This ticket has been reopened. Welcome back!`);
			} case "ticket_delete": {
				interaction.reply({
					embeds: [{
						description: "Ticket will be deleted in 5 seconds.",
						color: Colors.Red
					}]
				});

				try { setTimeout(() => interaction.channel.delete().catch((): any => { }), 5000); } catch (err: any) { }
			}
		}
	}
};
