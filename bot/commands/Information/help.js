const { MessageActionRow, MessageButton, MessageSelectMenu, MessageEmbed } = require("discord.js");

const cmd = require("../../templates/command");

async function execute(bot, message, args, command, data) {
	const prefix = data?.guild.prefix || await bot.database.getGuild(message.guild.id).prefix;
	const Selections = [];

	const CreateSelection = async (message, Category) => {
		if (Category.name.toLowerCase().includes("owner") && (message.author?.id || message.user.id) !== bot.config.ownerID) {
			return;
		}

		Selections.push({
			label: Category.name,
			description: Category.description,
			value: Category.name,
			emoji: Category.emoji ? Category.emoji : null,
		});
	};

	bot.categories.map(cat => CreateSelection(message, cat));

	if (!args[0]) {
		const NewEmbed = new MessageEmbed()
			.setTitle(await message.translate(bot, message, "Select a Category!"))
			.setDescription(await message.translate(bot, message, "Select a category from tapping the selection box below."))
			.setAuthor(await message.translate(bot, message, "SparkV Help"), bot.user.displayAvatarURL({ dynamic: true }))
			.setThumbnail(message.author ? message.author.displayAvatarURL({ dynamic: true }) : message.user.displayAvatarURL({ dynamic: true }))
			.setFooter(await message.translate(bot, message, "SparkV - Making your Discord life easier!"), bot.user.displayAvatarURL({ dynamic: true }))
			.setColor(bot.config.embed.color)
			.setTimestamp();

		const CatSelect = new MessageSelectMenu()
			.setCustomId("SelectHelpMenu")
			.setPlaceholder(await message.translate(bot, message, "Select a category to view it's cmds."))
			.addOptions(Selections);

		const InviteButton = new MessageButton().setURL(bot.config.bot_invite).setLabel("Bot Invite")
			.setStyle("LINK");

		const SupportButton = new MessageButton()
			.setURL(bot.config.support.invite)
			.setLabel(await message.translate(bot, message, "Support Invite"))
			.setStyle("LINK");

		const VoteButton = new MessageButton()
			.setURL("https://top.gg/bot/884525761694933073")
			.setLabel(await message.translate(bot, message, "Vote for me!"))
			.setStyle("LINK");

		const row = new MessageActionRow().addComponents(CatSelect);
		const row2 = new MessageActionRow().addComponents(InviteButton, SupportButton, VoteButton);

		return await message.reply({
			embeds: [NewEmbed],
			components: [row, row2],
			ephemeral: true
		});
	} else {
		const name = message.author ? args[0].toLowerCase() : args[0][0].toLowerCase();
		const cmd = bot.commands.get(name) || bot.aliases.get(name);

		if (!cmd) {
			return await message.reply({
				content: await message.translate(bot, message, "The cmd you requested could not be found."),
				ephemeral: true
			});
		}

		const cmdHelpEmbed = new MessageEmbed()
			.setTitle(`\`\`\`${cmd.settings.slash === true ? "/" : prefix}${cmd.settings.name} ${cmd.settings.usage}\`\`\``)
			.setDescription(await message.translate(bot, message, cmd.settings.description))
			.setThumbnail(message.author ? message.author.displayAvatarURL({ dynamic: true }) : message.user.displayAvatarURL({ dynamic: true }))
			.addField(await message.translate(bot, message, `**ALIASES**`), await message.translate(bot, message, `\`\`\`${cmd.settings.aliases.join(`,\n`)}\`\`\``), true)
			.addField(await message.translate(bot, message, `**CATEGORY**`), await message.translate(bot, message, `\`\`\`${cmd.category}\`\`\``), true)
			.addField(await message.translate(bot, message, `**COOLDOWN**`), await message.translate(bot, message, `\`\`\`${cmd.settings.cooldown / 1000} second(s)\`\`\``), true)
			.setFooter(await message.translate(bot, message, `${prefix}Help to get a list of all cmds • ${bot.config.embed.footer}`), bot.user.displayAvatarURL())
			.setColor(bot.config.embed.color);

		return await message.reply({
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
