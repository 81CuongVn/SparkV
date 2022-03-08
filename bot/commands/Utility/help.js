const { MessageActionRow, MessageButton, MessageSelectMenu, MessageEmbed } = require("discord.js");

const cmd = require("../../templates/command");

async function execute(bot, message, args, command, data) {
	const Selections = [];
	const categories = [];
	const pages = [];

	bot.categories.map(cat => {
		if (cat.name.toLowerCase().includes("owner") && (message.author?.id || message.user.id) !== bot.config.ownerID) return;

		categories.push({
			name: `${cat.emoji} ${cat.name} [${cat.commands.length}]`,
			value: `\`${cat.description}\``,
			inline: true
		});

		const commands = [];
		bot.commands
			.filter(command => command.settings.enabled && command.category === cat.name)
			.map(command => commands.push({
				name: `\`${command.settings?.slashOnly === true ? "/" : data.guild.prefix}${command.settings.name} ${command.settings.usage}\``,
				value: command.settings.description,
				inline: true
			}));

		const user = message.applicationId ? message.user : message.author;

		if (cat.name.toLowerCase().includes("owner") && (message.author?.id || message.user.id) !== bot.config.ownerID) return;

		const NewEmbed = new MessageEmbed()
			.setAuthor({
				name: `${cat.emojiID ? "" : cat.emoji}SparkV ${cat.name}`,
				iconURL: `https://cdn.discordapp.com/emojis/${cat.emojiID}.webp?size=56&quality=lossless`
			})
			.addFields(commands)
			.setFooter({
				text: "SparkV - Making your Discord life easier!",
				iconURL: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=256`
			})
			.setColor(bot.config.embed.color)
			.setTimestamp();

		pages.push(NewEmbed);
	});

	const InviteButton = new MessageButton()
		.setURL(bot.config.bot_invite)
		.setLabel("Invite")
		.setStyle("LINK");

	const SupportButton = new MessageButton()
		.setURL(bot.config.support.invite)
		.setLabel(await message.translate("Support Server"))
		.setStyle("LINK");

	const VoteButton = new MessageButton()
		.setURL("https://top.gg/bot/884525761694933073")
		.setEmoji(bot.config.emojis.stats)
		.setLabel(await message.translate("Vote"))
		.setStyle("LINK");

	const WebsiteButton = new MessageButton()
		.setURL("https://www.sparkv.tk/")
		.setEmoji(bot.config.emojis.globe)
		.setLabel(await message.translate("Website"))
		.setStyle("LINK");

	if (data?.options?.getString("search") || args[0]) {
		const name = message?.applicationId ? data.options.getString("search").toString().toLowerCase() : args[0].toString().toLowerCase();
		const cmd = bot.commands.get(name) || bot.aliases.get(name);
		const category = bot.categories.get(name.charAt(0).toUpperCase() + name.slice(1));

		let embed = new MessageEmbed();

		if (cmd) {
			embed
				.setAuthor({
					name: message?.applicationId ? message.user.tag : message.author.tag,
					iconURL: (message?.applicationId ? message.user : message.author).displayAvatarURL({ dynamic: true })
				})
				.setTitle(`\`\`\`${cmd.settings.slash === true ? "/" : data.guild.prefix}${cmd.settings.name} ${cmd.settings.usage}\`\`\``)
				.setDescription(await message.translate(cmd.settings.description))
				.addField(await message.translate("Category"), await message.translate(`\`\`\`${cmd.category}\`\`\``), true)
				.addField(await message.translate("Aliases"), cmd.settings.aliases ? await message.translate(`\`\`\`${cmd.settings.aliases.join(`,\n`)}\`\`\``) : `\`\`\`None.\`\`\``, true)
				.addField(await message.translate("Cooldown"), await message.translate(`\`\`\`${cmd.settings.cooldown / 1000} second(s)\`\`\``), true)
				.addField(await message.translate("Permissions"), await message.translate(`\`\`\`${cmd.perms ? cmd.perms.join("\n") : "None required."}\`\`\``), true)
				.setFooter({
					text: await message.translate(`${data.guild.prefix}Help to get a list of all commands • ${bot.config.embed.footer}`),
					iconURL: bot.user.displayAvatarURL()
				})
				.setColor(bot.config.embed.color);
		} else if (category) {
			embed = pages.filter(p => p.author.name.includes(category.name))[0];
		} else if (!cmd && !category) {
			embed
				.setAuthor({
					name: message?.applicationId ? message.user.tag : message.author.tag,
					iconURL: (message?.applicationId ? message.user : message.author).displayAvatarURL({ dynamic: true })
				})
				.setTitle("Uh oh!")
				.setDescription("**The command/category you requested could not be found. Need help? Contact support [here](https://discord.gg/PPtzT8Mu3h).**")
				.setColor("RED");
		}

		return await message.replyT({
			embeds: [embed],
			components: [
				new MessageActionRow().addComponents(InviteButton, SupportButton, VoteButton, WebsiteButton),
			]
		});
	}

	bot.categories.map(cat => {
		if (cat.name.toLowerCase().includes("owner") && (message.author?.id || message.user.id) !== bot.config.ownerID) return;

		Selections.push({
			label: `${cat.name} [${cat.commands.length}]`,
			description: cat.description,
			value: cat.name,
			emoji: cat.emoji ? cat.emoji : null,
		});
	});

	const Menu = new MessageEmbed()
		.setAuthor({
			name: "SparkV Menu",
			iconURL: bot.user.displayAvatarURL({ dynamic: true })
		})
		.setTitle("**Hi there!**")
		.setDescription("I'm a powerful multipurpose meme/chat bot with over **120+** commands to keep your server entertained and active, all while being free!\n\nWant to enable a setting? You can either run \`/settings\`, or go to our dashboard by clicking the button \`Dashboard\` below.\n\nA special thanks to [Icons by Danu](https://discord.gg/mm5QWaCWF5). They made most of the black and grey icons.\nIf you have any questions, feel free to join our server! https://discord.gg/PPtzT8Mu3h.")
		.setFooter({
			text: await message.translate(`${bot.config.embed.footer}`),
			iconURL: bot.user.displayAvatarURL({ dynamic: true })
		})
		.setColor(bot.config.embed.color)
		.setTimestamp();

	Selections.push({
		label: `Menu`,
		description: "Return to the main menu.",
		value: "menu",
		emoji: bot.config.emojis.leave
	});

	pages.push(Menu);

	const CatSelect = new MessageSelectMenu()
		.setCustomId("SelectHelpMenu")
		.setPlaceholder(await message.translate("Select a category to view its commands."))
		.addOptions(Selections);

	const helpMessage = await message.replyT({
		embeds: [Menu],
		components: [
			new MessageActionRow().addComponents(CatSelect),
			new MessageActionRow().addComponents(InviteButton, SupportButton, VoteButton, WebsiteButton),
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
					embeds: [pages.filter(p => p.author.name.toLowerCase().includes(interaction.values[0].toLowerCase()))[0]],
				});
			}
		}
	});

	collector.on("end", async () => {
		try {
			await helpMessage?.edit({
				components: []
			});
		} catch (err) {
			// Do nothing. This is just to stop errors from going into the console. It's mostly for the case where the message is deleted.
		}
	});
}

module.exports = new cmd(execute, {
	description: `View SparkV's 130+ commands.`,
	aliases: [`cmds`, `commands`, "vote"],
	usage: `(optional: search)`,
	perms: [],
	dirname: __dirname,
	slash: true,
	options: [
		{
			type: 3,
			name: "search",
			description: "Gives details about a certain cmd/category. Leave this option empty to send the whole cmd list."
		}
	]
});
