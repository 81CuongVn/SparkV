const { MessageActionRow, MessageButton, MessageSelectMenu, MessageEmbed } = require("discord.js");

const cmd = require("../../templates/command");

const emojis = [
	"⬅️",
	"◀️",
	"#️⃣",
	"▶️",
	"➡️"
];

async function execute(bot, message, args, command, data) {
	const prefix = data?.guild.prefix || await bot.database.getGuild(message.guild.id).prefix;
	const Selections = [];
	const pages = [];

	const CreateSelection = async (message, Category) => {
		if (Category.name.toLowerCase().includes("owner") && (message.author?.id || message.user.id) !== bot.config.ownerID) return;

		Selections.push({
			label: `${Category.name} [${Category.commands.length}]`,
			description: Category.description,
			value: Category.name,
			emoji: Category.emoji ? Category.emoji : null,
		});
	};

	const CreateCmdPage = async (bot, message, Category) => {
		const commands = [];
		bot.commands
			.filter(command => command.settings.enabled && command.category === Category.name)
			.map(command => commands.push({
				name: `\`${command.settings?.slashOnly === true ? "/" : data.guild.prefix}${command.settings.name} ${command.settings.usage}\``,
				value: command.settings.description,
				inline: true
			}));

		const user = message.applicationId ? message.user : message.author;

		if (Category.name.toLowerCase().includes("owner") && (message.author?.id || message.user.id) !== bot.config.ownerID) return;

		const NewEmbed = new MessageEmbed()
			.setAuthor({
				name: `${Category.emojiID ? "" : Category.emoji}SparkV ${Category.name}`,
				iconURL: `https://cdn.discordapp.com/emojis/${Category.emojiID}.webp?size=56&quality=lossless`
			})
			.addFields(commands)
			.setFooter({
				text: "SparkV - Making your Discord life easier!",
				iconURL: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=256`
			})
			.setColor(bot.config.embed.color)
			.setTimestamp();

		pages.push(NewEmbed);
	};

	if (data?.options?.getString("command") || args[0]) {
		const name = message?.applicationId ? data.options.getString("command").toLowerCase() : args[0].toLowerCase();
		const cmd = bot.commands.get(name) || bot.aliases.get(name);

		if (!cmd) {
			return await message.replyT({
				content: await message.translate("The cmd you requested could not be found."),
				ephemeral: true
			});
		}

		const cmdHelpEmbed = new MessageEmbed()
			.setTitle(`\`\`\`${cmd.settings.slash === true ? "/" : prefix}${cmd.settings.name} ${cmd.settings.usage}\`\`\``)
			.setDescription(await message.translate(cmd.settings.description))
			.addField(await message.translate("Category"), await message.translate(`\`\`\`${cmd.category}\`\`\``), true)
			.addField(await message.translate("Aliases"), cmd.settings.aliases ? await message.translate(`\`\`\`${cmd.settings.aliases.join(`,\n`)}\`\`\``) : `\`\`\`None.\`\`\``, true)
			.addField(await message.translate("Cooldown"), await message.translate(`\`\`\`${cmd.settings.cooldown / 1000} second(s)\`\`\``), true)
			.addField(await message.translate("Permissions"), await message.translate(`\`\`\`${cmd.perms ? cmd.perms.join("\n") : "None required."}\`\`\``), true)
			.setFooter({
				text: await message.translate(`${prefix}Help to get a list of all cmds • ${bot.config.embed.footer}`),
				iconURL: bot.user.displayAvatarURL()
			})
			.setColor(bot.config.embed.color);

		return await message.replyT({
			embeds: [cmdHelpEmbed],
			ephemeral: true
		});
	}

	bot.categories.map(cat => CreateSelection(message, cat));

	const categories = [];
	bot.categories.map(cat => categories.push({
		name: `${cat.emoji} ${cat.name} [${cat.commands.length}]`,
		value: cat.description,
		inline: true
	}));

	let PageNumber = 0;
	const NewEmbed = new MessageEmbed()
		.setAuthor({
			name: "SparkV Help",
			iconURL: bot.user.displayAvatarURL({ dynamic: true })
		})
		.addFields(categories)
		.setFooter({
			text: await message.translate(`Welcome to SparkV's help menu! Select a category from tapping the selection box below. • ${bot.config.embed.footer}`),
			iconURL: bot.user.displayAvatarURL({ dynamic: true })
		})
		.setColor(bot.config.embed.color)
		.setTimestamp();

	const quickLeft = new MessageButton()
		.setEmoji(emojis[0])
		.setCustomId("quickLeft")
		.setStyle("PRIMARY");

	const left = new MessageButton()
		.setEmoji(emojis[1])
		.setCustomId("left")
		.setStyle("PRIMARY");

	const number = new MessageButton()
		.setEmoji(emojis[2])
		.setCustomId("number")
		.setStyle("PRIMARY");

	const right = new MessageButton()
		.setEmoji(emojis[3])
		.setCustomId("right")
		.setStyle("PRIMARY");

	const quickRight = new MessageButton()
		.setEmoji(emojis[4])
		.setCustomId("quickRight")
		.setStyle("PRIMARY");

	const CatSelect = new MessageSelectMenu()
		.setCustomId("SelectHelpMenu")
		.setPlaceholder(await message.translate("Select a category to view it's cmds."))
		.addOptions(Selections);

	const InviteButton = new MessageButton()
		.setURL(bot.config.bot_invite)
		.setLabel("Invite")
		.setStyle("LINK");

	const SupportButton = new MessageButton()
		.setURL(bot.config.support.invite)
		.setLabel(await message.translate("Support Invite"))
		.setStyle("LINK");

	const VoteButton = new MessageButton()
		.setURL("https://top.gg/bot/884525761694933073")
		.setLabel(await message.translate("Vote"))
		.setStyle("LINK");

	bot.categories.map(cat => CreateCmdPage(bot, message, cat));

	const helpMessage = await message.replyT({
		embeds: [
			NewEmbed
		],
		components: [
			new MessageActionRow().addComponents(quickLeft, left, number, right, quickRight),
			new MessageActionRow().addComponents(CatSelect),
			new MessageActionRow().addComponents(InviteButton, SupportButton, VoteButton)
		],
		fetchReply: true
	});

	const collector = helpMessage.createMessageComponentCollector({
		filter: interaction => {
			if (!interaction.deferred && !interaction.customId === "SelectHelpMenu") interaction.deferUpdate();

			return true;
		}, time: 300 * 1000
	});

	collector.on("collect", async interaction => {
		if (interaction.customId) {
			if (interaction.customId === "SelectHelpMenu") {
				await interaction.update({
					embeds: [
						pages.filter(p => p.author.name.includes(interaction.values[0]))[0]
					],
					components: [
						new MessageActionRow().addComponents(quickLeft, left, number, right, quickRight),
						new MessageActionRow().addComponents(CatSelect),
						new MessageActionRow().addComponents(InviteButton, SupportButton, VoteButton),
					],
				});
			} else if (interaction.customId === "quickLeft") {
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
				const infoMsg = await message.replyT("Please send a page number.");

				await message.channel.awaitMessages({
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
				}).catch(async collected => await message.replyT("Canceled due to no valid response within 30 seconds."));
			} else {
				return;
			}
		}

		interaction.update({
			embeds: [
				pages[PageNumber].setFooter({
					text: `${bot.config.embed.footer} • Page ${PageNumber + 1}/${pages.length}`
				})
			],
		});
	});

	collector.on("end", async () => {
		await helpMessage.edit({
			embeds: [
				NewEmbed.setTitle(await message.translate("Help Command - Timed Out!"), bot.user.displayAvatarURL({ dynamic: true })).setDescription(await message.translate("You have gone inactive! Please rerun command to use this command again."))
			],
			components: []
		});
	});
}

module.exports = new cmd(execute, {
	description: `View SparkV's 130+ commands.`,
	aliases: [`cmds`, `commands`, "vote"],
	usage: `(optional: command)`,
	perms: ["EMBED_LINKS"],
	dirname: __dirname,
	slash: true,
	options: [
		{
			type: 3,
			name: "command",
			description: "gives details about a certain cmd. Leave this option empty to send the whole cmd list."
		}
	]
});
