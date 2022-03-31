const Discord = require("discord.js");

const cmd = require("@templates/command");

const Rules = new Discord.Collection();
let SetRules = false;

module.exports = new cmd(async (bot, message, args, command, data) => {
	if (SetRules === false) {
		Rules.set(1, {
			Title: "Automation",
			Description: "Using automation (Ex: auto-typers) is forbidden. Using automation (and with found proof) will cause a wipe of your data and a ban from using SparkV.",
		});

		Rules.set(2, {
			Title: "Command Spamming",
			Description:
				"Spamming commands is forbidden. Spamming SparkV's commands will result with a warning. If continued, a complete wipe of your data and a ban from SparkV",
		});

		Rules.set(3, {
			Title: "Alternate Accounts",
			Description:
				"Using alternate accounts to earn yourself money is forbidden. If continued (with found proof), your data will be wiped and you will be banned from SparkV.",
		});

		SetRules = true;
	}

	const pages = [];

	const CreatePage = (bot, Message, RuleNumber, RuleTitle, RuleDescription) => {
		const NewEmbed = new Discord.MessageEmbed()
			.setTitle(`Rule #${RuleNumber} - ${RuleTitle}`)
			.setDescription(`\`\`\`${RuleDescription}\`\`\``)
			.setColor(bot.config.embed.color)
			.setThumbnail(Message.user.displayAvatarURL({ dynamic: true }));

		pages.push(NewEmbed);
	};

	Rules.map((RuleDetails, RuleNumber) => CreatePage(bot, message, RuleNumber, RuleDetails.Title, RuleDetails.Description));

	const quickLeft = new Discord.MessageButton()
		.setEmoji("⬅️")
		.setCustomId("quickLeft")
		.setStyle("SECONDARY");

	const left = new Discord.MessageButton()
		.setEmoji(bot.config.emojis.arrows.left)
		.setCustomId("left")
		.setStyle("SECONDARY");

	const number = new Discord.MessageButton()
		.setEmoji(bot.config.emojis.channel)
		.setCustomId("number")
		.setStyle("SECONDARY");

	const right = new Discord.MessageButton()
		.setEmoji(bot.config.emojis.arrows.right)
		.setCustomId("right")
		.setStyle("SECONDARY");

	const quickRight = new Discord.MessageButton()
		.setEmoji("➡️")
		.setCustomId("quickRight")
		.setStyle("SECONDARY");

	const msg = await message.replyT({
		embeds: [pages[0]],
		components: [new Discord.MessageActionRow().addComponents(quickLeft, left, number, right, quickRight)],
		fetchReply: true
	});

	const collector = msg.createMessageComponentCollector({
		filter: interaction => {
			if (!interaction.deferred) interaction.deferUpdate();

			return true;
		}, time: 300 * 1000
	});

	collector.on("collect", async interaction => {
		if (interaction.customId) {
			if (interaction.customId === "quickLeft") {
				PageNumber = 0;
			} else if (interaction.customId === "left") {
				if (PageNumber > 0) {
					--PageNumber;
				} else {
					PageNumber = pages.length - 1;
				}
			} else if (interaction.customId === "right") {
				if (PageNumber + 1 < pages.length) {
					++PageNumber;
				} else {
					PageNumber = 0;
				}
			} else if (interaction.customId === "quickRight") {
				PageNumber = pages.length - 1;
			} else if (interaction.customId === "number") {
				const infoMsg = await interaction.replyT("Please send a page number.");

				await interaction.channel.awaitMessages({
					filter: msg => {
						if (msg.author.id === msg.client.user.id) return false;

						if (!msg.content) {
							msg.replyT("Please send a number!");

							return false;
						}

						if (!parseInt(msg.content) && isNaN(msg.content)) {
							msg.replyT("Please send a valid number!");

							return false;
						}

						if (parseInt(msg.content) > pages.length) {
							msg.replyT("That's a page number higher than the amount of pages there are.");

							return false;
						}

						return true;
					}, max: 1, time: 30 * 1000, errors: ["time"]
				}).then(async collected => {
					const input = parseInt(collected.first().content);

					PageNumber = input - 1;
					collected.first().delete().catch(err => { });
					infoMsg.delete().catch(err => { });
				}).catch(async collected => await interaction.replyT("Canceled due to no valid response within 30 seconds."));
			} else {
				return;
			}
		}

		try {
			interaction.edit({
				embeds: [
					pages[PageNumber].setFooter({
						text: `${bot.config.embed.footer} • Page ${PageNumber + 1}/${pages.length}`
					})
				],
			});
		} catch (err) {
			// Page deleted.
		}
	});
},
{
	description: "Follow the rules or else you will be banned from SparkV.",
	dirname: __dirname,
	usage: "",
	aliases: ["TOS"],
	perms: ["EMBED_LINKS", "MANAGE_MESSAGES"],
	slash: true
},
);
