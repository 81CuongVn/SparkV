const Discord = require("discord.js");
const canvacord = require("canvacord");

const cmd = require("@templates/command");

async function execute(bot, message, args, command, data) {
	const state = data.options.getSubcommand();

	if (state === "tickets") {
		const title = data.options.getString("title") || `${bot.config.emojis.ticket} | Get Support`;
		const description = data.options.getString("description") || "Need help? Click the button below to create a support ticket.";
		const color = data.options.getString("color") || bot.config.embed.color;

		const ticketEmbed = new Discord.MessageEmbed()
			.setTitle(title)
			.setDescription(description)
			.setColor(color);

		const ticketCreateButton = new Discord.MessageButton()
			.setLabel("Create Ticket")
			.setEmoji(bot.config.emojis.ticket)
			.setStyle("SECONDARY")
			.setCustomId("ticket_create");

		await message.channel.send({
			embeds: [ticketEmbed],
			components: [new Discord.MessageActionRow().addComponents(ticketCreateButton)]
		});

		const category = await message.guild.channels.cache.find(c => (c.name.toLowerCase().includes("support") || c.name.toLowerCase().includes("tickets")) && c.type === "GUILD_CATEGORY") || await message.guild.channels.create("Tickets", {
			type: "GUILD_CATEGORY"
		});

		data.guild.tickets.category = category.id;
		data.guild.markModified("tickets.category");
		await data.guild.save();

		await message.replyT(`${bot.config.emojis.success} | Successfully created ticket panel.`);
	} else if (state === "roles") {
		const title = data.options.getString("title") || `${bot.config.emojis.special} | Role Select`;
		const description = data.options.getString("description") || "Click the button(s) below to give yourself a role!";
		const color = data.options.getString("color") || bot.config.embed.color;

		const embed = new Discord.MessageEmbed()
			.setTitle(title)
			.setDescription(description)
			.setColor(color);

		const buttons = [];
		const button1 = new Discord.MessageButton()
			.setLabel(data.options.getString("role1_text"))
			.setStyle("SECONDARY")
			.setCustomId(`role_${data.options.getRole("role1").id}`);

		if (data.options.getString("role1_emoji")) button1.setEmoji(data.options.getString("role1_emoji"));

		buttons.push(button1);

		if (data.options.getRole("role2") && data.options.getString("role2_text")) {
			const button = new Discord.MessageButton()
				.setLabel(data.options.getString("role2_text") || "React to get a role")
				.setStyle("SECONDARY")
				.setCustomId(`role_${await data.options.getRole("role2").id}`);

			if (data.options.getString("role2_emoji")) button.setEmoji(data.options.getString("role2_emoji"));

			buttons.push(button);
		}

		if (data.options.getRole("role3") && data.options.getString("role3_text")) {
			const button = new Discord.MessageButton()
				.setLabel(data.options.getString("role3_text") || "React to get a role")
				.setStyle("SECONDARY")
				.setCustomId(`role_${await data.options.getRole("role3").id}`);

			if (data.options.getString("role3_emoji")) button.setEmoji(data.options.getString("role3_emoji"));

			buttons.push(button);
		}

		if (data.options.getRole("role4") && data.options.getString("role4_text")) {
			const button = new Discord.MessageButton()
				.setLabel(data.options.getString("role4_text") || "React to get a role")
				.setStyle("SECONDARY")
				.setCustomId(`role_${await data.options.getRole("role4").id}`);

			if (data.options.getString("role4_emoji")) button.setEmoji(data.options.getString("role4_emoji"));

			buttons.push(button);
		}

		if (data.options.getRole("role5") && data.options.getString("role5_text")) {
			const button = new Discord.MessageButton()
				.setLabel(data.options.getString("role5_text") || "React to get a role")
				.setStyle("SECONDARY")
				.setCustomId(`role_${await data.options.getRole("role5").id}`);

			if (data.options.getString("role5_emoji")) button.setEmoji(data.options.getString("role5_emoji"));

			buttons.push(button);
		}

		await message.channel.send({
			embeds: [embed],
			components: [
				{
					type: 1,
					components: buttons
				}
			]
		});

		await message.replyT(`${bot.config.emojis.success} | Successfully created roles select panel.`);
	} else if (state === "embed") {
		const title = data.options.getString("title");
		const description = data.options.getString("description");
		const color = data.options.getString("color") || bot.config.embed.color;

		const embed = new Discord.MessageEmbed()
			.setDescription(description.replaceAll("<br>", "\n"))
			.setColor(color);

		if (title) embed.setTitle(title);

		await message.channel.send({
			embeds: [embed]
		});

		await message.replyT(`${bot.config.emojis.success} | Successfully created embed.`);
	}
}

module.exports = new cmd(execute, {
	description: "Set up a feature. (tickets, roles, embed)",
	dirname: __dirname,
	aliases: [],
	perms: ["MANAGE_GUILD"],
	usage: "(tickets|roles|embed) (title|description|color)",
	slash: true,
	slashOnly: true,
	ephemeral: true,
	options: [
		{
			type: 1,
			name: "tickets",
			description: "Allow users to open a ticket in your server.",
			options: [
				{
					type: 3,
					name: "title",
					description: "The title to the ticket embed."
				},
				{
					type: 3,
					name: "description",
					description: "The description to the ticket embed."
				},
				{
					type: 3,
					name: "color",
					description: "The color to ALL the ticket embeds.",
					choices: [
						{
							name: "white",
							value: "WHITE"
						},
						{
							name: "aqua",
							value: "AQUA"
						},
						{
							name: "dark_aqua",
							value: "DARK_AQUA"
						},
						{
							name: "blue",
							value: "BLUE"
						},
						{
							name: "dark_blue",
							value: "DARK_BLUE"
						},
						{
							name: "green",
							value: "GREEN"
						},
						{
							name: "dark_green",
							value: "DARK_GREEN"
						},
						{
							name: "purple",
							value: "PURPLE"
						},
						{
							name: "dark_purple",
							value: "DARK_PURPLE"
						},
						{
							name: "yellow",
							value: "YELLOW"
						},
						{
							name: "gold",
							value: "GOLD"
						},
						{
							name: "dark_gold",
							value: "DARK_GOLD"
						},
						{
							name: "orange",
							value: "ORANGE"
						},
						{
							name: "dark_orange",
							value: "DARK_ORANGE"
						},
						{
							name: "red",
							value: "RED"
						},
						{
							name: "dark_red",
							value: "DARK_RED"
						},
						{
							name: "grey",
							value: "GREY"
						},
						{
							name: "dark_GREY",
							value: "DARK_GREY"
						},
						{
							name: "darker_grey",
							value: "DARKER_GREY"
						},
						{
							name: "light_grey",
							value: "LIGHT_GREY"
						},
						{
							name: "navy",
							value: "NAVY"
						},
						{
							name: "dark_navy",
							value: "DARK_NAVY"
						},
						{
							name: "blurple",
							value: "BLURPLE"
						},
						{
							name: "random",
							value: "RANDOM"
						}
					]
				}
			]
		},
		{
			type: 1,
			name: "roles",
			description: "Create a message that allows you to get roles by clicking a button.",
			options: [
				{
					type: 8,
					name: "role1",
					description: "The first role button.",
					required: true
				},
				{
					type: 3,
					name: "role1_text",
					description: "The first role button's text.",
					required: true
				},
				{
					type: 3,
					name: "role1_emoji",
					description: "The emoji to use for the first role button.",
				},
				{
					type: 8,
					name: "role2",
					description: "The second role button."
				},
				{
					type: 3,
					name: "role2_text",
					description: "The second role button's text."
				},
				{
					type: 3,
					name: "role2_emoji",
					description: "The emoji to use for the second role button.",
				},
				{
					type: 8,
					name: "role3",
					description: "The third role button."
				},
				{
					type: 3,
					name: "role3_text",
					description: "The third role button's text."
				},
				{
					type: 3,
					name: "role3_emoji",
					description: "The emoji to use for the third role button.",
				},
				{
					type: 8,
					name: "role4",
					description: "The fourth role button."
				},
				{
					type: 3,
					name: "role4_text",
					description: "The fourth role button's text."
				},
				{
					type: 3,
					name: "role4_emoji",
					description: "The emoji to use for the fourth role button.",
				},
				{
					type: 8,
					name: "role5",
					description: "The fifth role button."
				},
				{
					type: 3,
					name: "role5_text",
					description: "The fifth role button's text."
				},
				{
					type: 3,
					name: "role5_emoji",
					description: "The emoji to use for the fifth role button.",
				},
				{
					type: 3,
					name: "title",
					description: "The title to the ticket embed."
				},
				{
					type: 3,
					name: "description",
					description: "The description to the ticket embed."
				},
				{
					type: 3,
					name: "color",
					description: "The color to ALL the ticket embeds.",
					choices: [
						{
							name: "white",
							value: "WHITE"
						},
						{
							name: "aqua",
							value: "AQUA"
						},
						{
							name: "dark_aqua",
							value: "DARK_AQUA"
						},
						{
							name: "blue",
							value: "BLUE"
						},
						{
							name: "dark_blue",
							value: "DARK_BLUE"
						},
						{
							name: "green",
							value: "GREEN"
						},
						{
							name: "dark_green",
							value: "DARK_GREEN"
						},
						{
							name: "purple",
							value: "PURPLE"
						},
						{
							name: "dark_purple",
							value: "DARK_PURPLE"
						},
						{
							name: "yellow",
							value: "YELLOW"
						},
						{
							name: "gold",
							value: "GOLD"
						},
						{
							name: "dark_gold",
							value: "DARK_GOLD"
						},
						{
							name: "orange",
							value: "ORANGE"
						},
						{
							name: "dark_orange",
							value: "DARK_ORANGE"
						},
						{
							name: "red",
							value: "RED"
						},
						{
							name: "dark_red",
							value: "DARK_RED"
						},
						{
							name: "grey",
							value: "GREY"
						},
						{
							name: "dark_GREY",
							value: "DARK_GREY"
						},
						{
							name: "darker_grey",
							value: "DARKER_GREY"
						},
						{
							name: "light_grey",
							value: "LIGHT_GREY"
						},
						{
							name: "navy",
							value: "NAVY"
						},
						{
							name: "dark_navy",
							value: "DARK_NAVY"
						},
						{
							name: "blurple",
							value: "BLURPLE"
						},
						{
							name: "random",
							value: "RANDOM"
						}
					]
				}
			]
		},
		{
			type: 1,
			name: "embed",
			description: "Create an embed.",
			options: [
				{
					type: 3,
					name: "description",
					description: "The description to the ticket embed.",
					required: true
				},
				{
					type: 3,
					name: "title",
					description: "The title to the ticket embed."
				},
				{
					type: 3,
					name: "color",
					description: "The color to ALL the ticket embeds.",
					choices: [
						{
							name: "white",
							value: "WHITE"
						},
						{
							name: "aqua",
							value: "AQUA"
						},
						{
							name: "dark_aqua",
							value: "DARK_AQUA"
						},
						{
							name: "blue",
							value: "BLUE"
						},
						{
							name: "dark_blue",
							value: "DARK_BLUE"
						},
						{
							name: "green",
							value: "GREEN"
						},
						{
							name: "dark_green",
							value: "DARK_GREEN"
						},
						{
							name: "purple",
							value: "PURPLE"
						},
						{
							name: "dark_purple",
							value: "DARK_PURPLE"
						},
						{
							name: "yellow",
							value: "YELLOW"
						},
						{
							name: "gold",
							value: "GOLD"
						},
						{
							name: "dark_gold",
							value: "DARK_GOLD"
						},
						{
							name: "orange",
							value: "ORANGE"
						},
						{
							name: "dark_orange",
							value: "DARK_ORANGE"
						},
						{
							name: "red",
							value: "RED"
						},
						{
							name: "dark_red",
							value: "DARK_RED"
						},
						{
							name: "grey",
							value: "GREY"
						},
						{
							name: "dark_GREY",
							value: "DARK_GREY"
						},
						{
							name: "darker_grey",
							value: "DARKER_GREY"
						},
						{
							name: "light_grey",
							value: "LIGHT_GREY"
						},
						{
							name: "navy",
							value: "NAVY"
						},
						{
							name: "dark_navy",
							value: "DARK_NAVY"
						},
						{
							name: "blurple",
							value: "BLURPLE"
						},
						{
							name: "random",
							value: "RANDOM"
						}
					]
				}
			]
		},
	]
});
