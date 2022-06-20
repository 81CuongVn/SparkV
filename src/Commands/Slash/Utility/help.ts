const { MessageActionRow, MessageButton, MessageSelectMenu, MessageEmbed } = require("discord.js");

import cmd from "../../../structures/command";

async function execute(bot: any, message: any, args: string[], command: any, data: any) {
	const Selections = [];
	const pages: any = [] = [];

	bot.categories.map((cat: { name: string; emojiID: any; emoji: any; }) => {
		if (cat.name.toLowerCase().includes("owner") && !bot.config.owners.includes(message.author?.id || message.user.id)) return;

		const commands: { name: string; value: string; }[] = [];
		bot.commands
			.filter((command: { settings: { enabled: any; }; category: any; }) => command.settings.enabled && command.category === cat.name)
			.map(async (command: { settings: { name: any; usage: any; description: any; options: any[]; }; }) => commands.push({
				name: `\`\`\`/${command.settings.name} ${command.settings.usage}\`\`\``,
				value: `${command.settings.description}${command.settings.options ? `\n\n${command.settings.options.filter((option: { type: number; }) => option.type === 1).map((option: { name: any; options: any[]; }) => `${bot.config.emojis.circle} \`/${command.settings.name} ${option.name} ${option?.options ? option.options.map((op: { name: any; }) => `(${op.name})`).join(" ") : ""}\``).join("\n")}` : ""}`
			}));

		const user = message.applicationId ? message.user : message.author;
		const NewEmbed = new MessageEmbed()
			.setAuthor({
				name: (message?.applicationId ? message.user : message.author).tag,
				iconURL: (message?.applicationId ? message.user : message.author).displayAvatarURL({ dynamic: true })
			})
			.addFields(commands)
			.setThumbnail(bot.user.displayAvatarURL())
			.setImage("https://www.sparkv.tk/images/banner.gif")
			.setFooter({
				text: `${cat.emojiID ? "" : cat.emoji}SparkV ${cat.name}`,
				iconURL: `https://cdn.discordapp.com/emojis/${cat.emojiID}.webp?size=56&quality=lossless`
			})
			.setColor(bot.config.embed.color)
			.setTimestamp();

		pages.push(NewEmbed);
	});

	const InviteButton = new MessageButton()
		.setURL(bot.config.bot_invite)
		.setEmoji(bot.config.emojis.plus)
		.setLabel(await message.translate("Invite"))
		.setStyle("LINK");

	const SupportButton = new MessageButton()
		.setURL(bot.config.support.invite)
		.setEmoji(bot.config.emojis.question)
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

	if (data.options.getString("search")) {
		const name = data.options.getString("search").toString().toLowerCase();
		const cmd = bot.commands.get(name) || bot.aliases.get(name);
		const category = bot.categories.get(name.charAt(0).toUpperCase() + name.slice(1));

		let embed = new MessageEmbed();

		if (cmd) {
			embed
				.setAuthor({
					name: message?.applicationId ? message.user.tag : message.author.tag,
					iconURL: (message?.applicationId ? message.user : message.author).displayAvatarURL({ dynamic: true })
				})
				.setTitle(`\`\`\`/${cmd.settings.name} ${cmd.settings.usage}\`\`\``)
				.setDescription(await message.translate(cmd.settings.description))
				.addField(await message.translate("Category"), await message.translate(`\`\`\`${cmd.category}\`\`\``), true)
				.addField(await message.translate("Aliases"), cmd.settings.aliases ? await message.translate(`\`\`\`${cmd.settings.aliases.join(`,\n`)}\`\`\``) : `\`\`\`None.\`\`\``, true)
				.addField(await message.translate("Cooldown"), await message.translate(`\`\`\`${cmd.settings.cooldown / 1000} second(s)\`\`\``), true)
				.addField(await message.translate("Permissions"), await message.translate(`\`\`\`${cmd.perms ? cmd.perms.join("\n") : "None required."}\`\`\``), true)
				.setFooter({
					text: await message.translate(`Type /help to get a list of all commands • ${bot.config.embed.footer}`),
					iconURL: bot.user.displayAvatarURL()
				})
				.setColor(bot.config.embed.color);
		} else if (category) {
			embed = pages.filter((p: { author: { name: string | any[]; }; }) => p.author.name.includes(category.name))[0];
		} else if (!cmd && !category) {
			embed
				.setAuthor({
					name: message?.applicationId ? message.user.tag : message.author.tag,
					iconURL: (message?.applicationId ? message.user : message.author).displayAvatarURL({ dynamic: true })
				})
				.setTitle(await message.translate("Uh oh!"))
				.setDescription(await message.translate("**The command/category you requested could not be found. Need help? Contact support [here](https://discord.gg/PPtzT8Mu3h).**"))
				.setColor("RED");
		}

		return await message.replyT({
			embeds: [embed],
			components: [
				new MessageActionRow().addComponents(InviteButton, SupportButton, VoteButton, WebsiteButton)
			]
		});
	}

	bot.categories.map(async (cat: { name: string; commands: string | any[]; description: any; emoji: any; }) => {
		if (cat.name.toLowerCase().includes("owner") && !bot.config.owners.includes(message.author?.id || message.user.id)) return;

		Selections.push({
			label: `${await message.translate(cat.name)} [${cat.commands.length}]`,
			description: cat.description,
			value: cat.name,
			emoji: cat.emoji ? cat.emoji : null
		});
	});

	const Menu = new MessageEmbed()
		.setAuthor({
			name: (message?.applicationId ? message.user : message.author).tag,
			iconURL: (message?.applicationId ? message.user : message.author).displayAvatarURL({ dynamic: true })
		})
		.setDescription(`**${await message.translate("Hi there!")}**\n${await message.translate("I'm a powerful Discord bot with the purpose to make your server better and more unique, without making things complicated. I have many features which have been proven to boost your server's activity. If you want to setup/configure SparkV, run")} \`/settings\`.\n\n${await message.translate("A special thanks to")} [Danu](https://discord.gg/mm5QWaCWF5) ${await message.translate("for making most of our cool icons.")}\n${await message.translate("If you have any questions, feel free to join our")} [Discord ${await message.translate("server")}](https://discord.gg/PPtzT8Mu3h).`)
		.setImage("https://www.sparkv.tk/images/banner.gif")
		.setFooter({
			text: await message.translate(`SparkV Main Menu • ${await message.translate(`${bot.config.embed.footer}`)}`),
			iconURL: bot.user.displayAvatarURL({ dynamic: true })
		})
		.setColor(bot.config.embed.color)
		.setTimestamp();

	Selections.push({
		label: await message.translate(`Menu`),
		description: await message.translate("Return to the main menu."),
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
			new MessageActionRow().addComponents(InviteButton, SupportButton, VoteButton, WebsiteButton)
		],
		fetchReply: true
	});

	const collector = helpMessage.createMessageComponentCollector({ ime: 300 * 1000 });

	collector.on("collect", async (interaction: { deferred: any; customId: string; deferUpdate: () => Promise<any>; values: string[]; update: (arg0: { embeds: any[]; components: any[]; fetchReply: boolean; }) => any; }) => {
		if (!interaction.deferred && !(interaction.customId === "SelectHelpMenu")) interaction.deferUpdate().catch((): any => { });
		if (interaction.customId === "SelectHelpMenu") {
			const page = pages.find((p: { footer: { text: string; }; }) => p.footer.text.toLowerCase().includes(interaction.values[0].toLowerCase()));
			if (!page) return;

			await interaction.update({
				embeds: [page],
				components: [],
				fetchReply: true
			});
		}
	});

	collector.on("end", async () => {
		try {
			await helpMessage?.edit({
				components: []
			});
		} catch (err) { }
	});
}

export default new cmd(execute, {
	description: `Get help with SparkV, or view SparkV's commands.`,
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
