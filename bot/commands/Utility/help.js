const { MessageActionRow, MessageButton, MessageSelectMenu, MessageEmbed } = require("discord.js");

const cmd = require("../../templates/command");

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

	const CreateCmdPage = async (bot, interaction, Category) => {
		if (Category.name.toLowerCase().includes("owner") && interaction.user.id !== bot.config.ownerID) return;

		const NewEmbed = new MessageEmbed()
			.setAuthor({
				name: `${Category.emoji} SparkV Help - ${Category.name}`,
				iconURL: `https://cdn.discordapp.com/avatars/${interaction.message.author.id}/${interaction.message.author.avatar}.png?size=256`
			})
			.setDescription(bot.commands
				.filter(command => command.settings.enabled && command.category === Category.name)
				.map(command => `\`^${command.settings.name} ${command.settings.usage}\`\n${command.settings.description}`)
				.join(`\n\n`))
			.setThumbnail(`https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.png?size=256`)
			.setFooter({
				text: "SparkV - Making your Discord life easier!",
				iconURL: `https://cdn.discordapp.com/avatars/${interaction.message.author.id}/${interaction.message.author.avatar}.png?size=256`
			})
			.setColor(bot.config.embed.color)
			.setTimestamp();

		pages.push(NewEmbed);
	};

	if (!args[0]) {
		bot.categories.map(cat => CreateSelection(message, cat));

		const NewEmbed = new MessageEmbed()
			.setAuthor({
				name: "SparkV Help",
				iconURL: bot.user.displayAvatarURL({ dynamic: true })
			})
			.setDescription(await message.translate("Welcome to SparkV's help menu! Select a category from tapping the selection box below."))
			.setThumbnail(message.author ? message.author.displayAvatarURL({ dynamic: true }) : message.user.displayAvatarURL({ dynamic: true }))
			.setFooter({
				text: await message.translate(bot.config.embed.footer),
				iconURL: bot.user.displayAvatarURL({ dynamic: true })
			})
			.setColor(bot.config.embed.color)
			.setTimestamp();

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

		const row = new MessageActionRow().addComponents(CatSelect);
		const row2 = new MessageActionRow().addComponents(InviteButton, SupportButton, VoteButton);

		const helpMessage = await message.replyT({
			embeds: [NewEmbed],
			components: [row, row2],
			fetchReply: true
		});

		const collector = helpMessage.createMessageComponentCollector({ filter: interaction => interaction.customId === "SelectHelpMenu", time: 300 * 1000 });
		collector.on("collect", async interaction => {
			bot.categories.map(cat => CreateCmdPage(bot, interaction, cat));

			await interaction.update({
				embeds: [
					pages.filter(p => p.author.name.includes(interaction.values[0]))[0]
				],
				components: [
					new MessageActionRow().addComponents(CatSelect),
					new MessageActionRow().addComponents(InviteButton, SupportButton, VoteButton),
				],
			});
		});

		collector.on("end", async () => {
			await helpMessage.edit({
				embeds: [
					NewEmbed.setTitle(await message.translate("Timed Out!"), bot.user.displayAvatarURL({ dynamic: true })).setDescription(await message.translate("Please rerun command."))
				],
				components: [],
				ephemeral: true
			});
		});
	} else {
		const name = message.author ? args[0].toLowerCase() : args[0][0].toLowerCase();
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
			.setThumbnail(message.author ? message.author.displayAvatarURL({ dynamic: true }) : message.user.displayAvatarURL({ dynamic: true }))
			.addField(await message.translate(`**ALIASES**`), await message.translate(`\`\`\`${cmd.settings.aliases.join(`,\n`)}\`\`\``), true)
			.addField(await message.translate(`**CATEGORY**`), await message.translate(`\`\`\`${cmd.category}\`\`\``), true)
			.addField(await message.translate(`**COOLDOWN**`), await message.translate(`\`\`\`${cmd.settings.cooldown / 1000} second(s)\`\`\``), true)
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
}

module.exports = new cmd(execute, {
	description: `View SparkV's 100+ cmds.`,
	aliases: [`cmds`, `commands`, "vote"],
	usage: `<cmd>`,
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
