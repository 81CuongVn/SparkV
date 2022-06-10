/* eslint-disable arrow-body-style */
const Discord = require("discord.js");
const ms = require("ms");

const cmd = require("@structures/command");

async function execute(bot, message, args, command, data) {
	const state = data.options.getSubcommand();

	if (state === "create") {
		const prize = data.options.getString("prize");
		const duration = ms(data.options.getString("time"));

		const channel = data.options.getChannel("channel") || message.channel;
		const description = data.options.getString("description");
		const color = data.options.getString("color") || bot.config.embed.color;
		const winnerCount = data.options.getNumber("winners") || 1;

		await message.replyT({
			content: `${bot.config.emojis.party} Giveaway created!`,
			ephemeral: true
		});

		const msg = await channel.send({
			embeds: [
				new Discord.MessageEmbed()
					.setTitle(prize)
					.setDescription(`${description ? `${description}\n\n` : ""}${bot.config.emojis.clock} Ends <t:${~~(new Date().getTime() + duration / 1000)}:R>`)
					.setColor(color)
			],
			fetchReply: true
		});
		await msg.react("🎉");
	} else if (state === "delete") {
		const ID = data.options.getString("id");

		const Giveaway = bot.GiveawayManager.giveaways.find(giveaway => giveaway.messageID === ID);
		if (!Giveaway) return await message.editT(`${bot.config.emojis.error} | I couldn't find a giveaway with that message ID.`);

		bot.GiveawayManager.delete(Giveaway.messageID).then(async () => await message.editT(`Giveaway successfully deleted!`)).catch(async err => {
			bot.logger(err, "error");

			await message.replyT(`${bot.config.emojis.error} | An error occured with SparkV! Please try this command again later.`);
		});
	} else if (state === "pause") {
		const ID = data.options.getString("id");

		const Giveaway = bot.GiveawayManager.giveaways.find(giveaway => giveaway.messageID === ID);

		if (!Giveaway) return await message.editT(`I couldn't find a giveaway with that message ID.`);
		if (Giveaway.pauseOptions.isPaused) return await message.editT(`Giveaway is already paused.`);

		bot.giveawaysManager.pause(messageId).then(() => {
			message.replyT("Success! Giveaway paused!");
		}).catch(err => {
			interaction.channel.send(`${bot.config.emojis.error} | An error has occurred.`);
		});

		await message.editT(`Giveaway paused!`);
	} else if (state === "resume") {
		const ID = data.options.getString("id");

		const Giveaway = bot.GiveawayManager.giveaways.find(giveaway => giveaway.messageID === ID);

		if (!Giveaway) return await message.editT(`${bot.config.emojis.error} | I couldn't find a giveaway with that message ID.`);
		if (!Giveaway.isPaused) return await message.editT(`${bot.config.emojis.error} | Giveaway is not paused.`);

		Giveaway.resume();

		await message.editT(`${bot.config.emojis.success} | Giveaway successfully resumed!`);
	} else if (state === "reroll") {
		const ID = data.options.getString("id");

		const Giveaway = bot.GiveawayManager.giveaways.find(giveaway => giveaway.messageID === ID);

		if (!Giveaway) return await message.editT(`${bot.config.emojis.error} | I couldn't find a giveaway with that message ID.`);

		bot.GiveawayManager.reroll(Giveaway.messageID).then(async () => await message.replyT("Giveaway successfully rerolled!")).catch(async err => {
			if (err.startsWith(`Giveaway with ID ${Giveaway.messageID} is not ended`)) {
				await message.replyT(`${bot.config.emojis.error} | This giveaway hasn't ended yet!`);
			} else {
				bot.logger(err, "error");

				await message.replyT(`${bot.config.emojis.error} | An error occured with SparkV! Please try this command again.`);
			}
		});
	}
}

module.exports = new cmd(execute, {
	description: `Create, delete, pause, resume, reroll, or reroll a giveaway.`,
	dirname: __dirname,
	usage: "",
	aliases: ["startg", "sgiveaway", "cgiveaway", "createg"],
	perms: ["EMBED_LINKS", "MANAGE_MESSAGES"],
	slash: true,
	slashOnly: true,
	ephemeral: true,
	enabled: false,
	options: [
		{
			type: 1,
			name: "create",
			description: "Create a giveaway.",
			options: [
				{
					type: 3,
					name: "prize",
					description: "The price for the winners to receive.",
					required: true
				},
				{
					type: 3,
					name: "time",
					description: "How long the giveaway should last for.",
					required: true
				},
				{
					type: 7,
					name: "channel",
					description: "The channel to create the giveaway in."
				},
				{
					type: 3,
					name: "description",
					description: "The description for the giveaway."
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
							name: "luminous_vivid_pink",
							value: "LUMINOUS_VIVID_PINK"
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
				},
				{
					type: 10,
					name: "winners",
					description: "How many people can win the giveaway."
				}
			]
		},
		{
			type: 1,
			name: "delete",
			description: "Delete a giveaway.",
			options: [
				{
					type: 3,
					name: "id",
					description: "The message id for the giveaway. ",
					required: true
				}
			]
		},
		{
			type: 1,
			name: "reroll",
			description: "Reroll a giveaway.",
			options: [
				{
					type: 3,
					name: "id",
					description: "The message id for the giveaway. ",
					required: true
				}
			]
		}
	]
});
