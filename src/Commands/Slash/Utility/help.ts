import { ButtonBuilder, EmbedBuilder, ButtonStyle, Colors, PermissionsBitField } from "discord.js";
import os from "os";
import axios from "axios";

import cmd from "../../../structures/command";

async function execute(bot: any, message: any, args: string[], command: any, data: any) {
	const pages: any = [] = [];

	/* -------------------------------------------------- BUTTONS --------------------------------------------------*/
	const InviteButton = new ButtonBuilder().setEmoji(bot.config.emojis.plus).setLabel(await message.translate("Invite"))
		.setURL(bot.config.bot_invite).setStyle(ButtonStyle.Link);
	const SupportButton = new ButtonBuilder().setEmoji(bot.config.emojis.question).setLabel(await message.translate("Support Server"))
		.setURL(bot.config.support).setStyle(ButtonStyle.Link);
	const VoteButton = new ButtonBuilder().setEmoji(bot.config.emojis.stats).setLabel(await message.translate("Vote"))
		.setURL("https://top.gg/bot/884525761694933073").setStyle(ButtonStyle.Link);
	const WebsiteButton = new ButtonBuilder().setEmoji(bot.config.emojis.globe).setLabel(await message.translate("Website"))
		.setURL("https://www.sparkv.tk/").setStyle(ButtonStyle.Link)

	/* -------------------------------------------------- CREATE MENU --------------------------------------------------*/
	pages.push({
		author: {
			name: message.user.tag,
			icon_url: message.user.displayAvatarURL()
		},
		title: `${bot.config.emojis.wave} | ${await message.translate("Hi there!")}`,
		description: `${bot.config.emojis.info} | **${await message.translate("About SparkV")}**\n> ${await message.translate("I'm a powerful Discord bot with the purpose to make your server better and more unique.\n> If you want to setup/configure SparkV, run")} \`/settings\`.\n\n${bot.config.emojis.award} | **${await message.translate("Credits")}**\n> [Danu](https://discord.gg/mm5QWaCWF5) • ${await message.translate("Made black and white icons.")}\n> [Unbreakablenight](https://unbreakable.tk/) • ${await message.translate("Made new SparkV Logo.")}\n\n${bot.config.emojis.question} | **${await message.translate("Join Our Community!")}**\n> ${await message.translate("Feel free to join our")} [Discord ${await message.translate("server")}](https://discord.gg/PPtzT8Mu3h).`,
		color: Colors.Blue,
		timestamp: new Date(),
		image: { url: "https://www.sparkv.tk/images/banner.gif" },
		footer: {
			text: `SparkV Menu • ${await message.translate("The bot that has everything!")}`,
			icon_url: bot.user.displayAvatarURL()
		}
	});

	/* -------------------------------------------------- CREATE COMMANDS --------------------------------------------------*/
	/* OLD: commands.push({
		name: `\`\`\`/${command.settings.name} ${command.settings.usage}\`\`\``,
		value: `${command.settings.description}${command.settings.options ? `\n\n${command.settings.options.filter((option: any) => option.type === 1).map((option: any) => `${bot.config.emojis.circle} \`/${command.settings.name} ${option.name} ${option?.options ? option.options.map((op: any) => `(${op.name})`).join(" ") : ""}\``).join("\n")}` : ""}`
	}) */
	const commands: any[] = [];
	let totalCmds: number = 0;
	bot.categories.map((cat: any) => commands.push({
		name: `${cat.emoji} **${cat.name}**`,
		value: bot.commands.filter((command: any) => command.settings.enabled && command.category === cat.name).map((command: any) => { totalCmds++; return `\`/${command?.settings?.name}\`` }).join(", ")
	}));

	pages.push({
		author: {
			name: message.user.tag,
			icon_url: message.user.displayAvatarURL()
		},
		fields: commands,
		thumbnail: { url: bot.user.displayAvatarURL() },
		image: { url: "https://www.sparkv.tk/images/banner.gif" },
		color: Colors.Blue,
		timestamp: new Date(),
		footer: {
			text: `SparkV Commands • ${await message.translate("The bot that has everything!")}`,
			icon_url: bot.user.displayAvatarURL()
		}
	});

	/* -------------------------------------------------- CREATE STATS --------------------------------------------------*/
	const statcord = await axios.get(`https://api.statcord.com/v3/${bot.user.id}`).then((res: any) => res.data.data[0]).catch((): any => { });
	pages.push({
		author: {
			name: message.user.tag,
			icon_url: message.user.displayAvatarURL()
		},
		fields: [{
			name: `**${await message.translate("Server")}**`,
			value: `${bot.config.emojis.rocket} ${await message.translate("CPU")}: **${statcord.cpuload}%**\n${bot.config.emojis.stats} Memory: **${(((os.totalmem() - os.freemem()) / (os.totalmem())) * 100).toFixed(2)}%**\n${bot.config.emojis.clock} Uptime: **${bot.functions.MSToTime(bot.uptime, "short")}**`,
			inline: true
		}, {
			name: `**${await message.translate("Bot Statistics")}**`,
			value: `${bot.config.emojis.globe} ${await message.translate("Servers")}: **${bot.functions.formatNumber(await bot.functions.GetServerCount())}**\n${bot.config.emojis.player} Users: **${bot.functions.formatNumber(await bot.functions.GetUserCount())}**`,
			inline: true
		}],
		thumbnail: { url: bot.user.displayAvatarURL() },
		image: { url: `https://dblstatistics.com/bot/${bot.user.id}/widget/servers?width=1500&height=700&titleFontSize=20&labelFontSize=40&fillColor=0a1227?&lineColor=4752cc&backgroundColor=00000000` },
		color: Colors.Blue,
		timestamp: new Date(),
		footer: {
			text: `SparkV Stats • ${await message.translate("The bot that has everything!")}`,
			iconURL: bot.user.displayAvatarURL()
		}
	});

	/* -------------------------------------------------- CREATE PERMISSIONS --------------------------------------------------*/
	const requiredPerms = ["KickMembers", "BanMembers", "ManageChannel", "ManageGuild", "AddReactions", "ViewChannel",
		"SendMessages", "ManageMessages", "EmbedLinks", "AttachFiles", "ReadMessageHistory", "UseExternalEmojis", "Connect",
		"Speak", "ManageNicknames", "ManageRoles"];

	let permDescription = "";
	Object.keys(PermissionsBitField.Flags).forEach(perm => {
		if (requiredPerms.filter(p => p === perm).length > 0) {
			if (message.channel.permissionsFor(message.guild.members.cache.get(bot.user.id)).has(perm)) permDescription += `> ${bot.config.emojis.success} ${perm}\n`;
			else permDescription += `> ${bot.config.emojis.alert} **${perm}**\n`;
		}
	});

	pages.push({
		author: {
			name: message.user.tag,
			icon_url: message.user.displayAvatarURL()
		},
		description: `**Permissions**\n> *Below are a list of permissions SparkV needs in order to work correctly in this server.*\n\n${permDescription}`,
		thumbnail: { url: bot.user.displayAvatarURL() },
		image: { url: "https://www.sparkv.tk/images/banner.gif" },
		color: Colors.Blue,
		timestamp: new Date(),
		footer: {
			text: `SparkV Permissions • ${await message.translate("The bot that has everything!")}`,
			iconURL: bot.user.displayAvatarURL()
		}
	});

	/* -------------------------------------------------- CREATE RULES --------------------------------------------------*/
	const rules = [
		"No Automation. Using automation (Ex: auto-typers) is forbidden. Using automation (and with found proof) will cause a wipe of your data and a ban from using SparkV.",
		"No spamming commands. Spamming SparkV's commands will result with a warning. If continued, a complete wipe of your data and a ban from SparkV will be given to you.",
		"No using alternate accounts to earn yourself money. If proof is found, your data will be wiped and you will be banned from SparkV."
	];

	let ruleDescription: string = "";
	let number: number = 0;
	rules.forEach(rule => {
		number++;
		ruleDescription += `**${number}.** ${rule}\n`;
	});

	pages.push({
		author: {
			name: message.user.tag,
			icon_url: message.user.displayAvatarURL()
		},
		description: `**Rules**\n> *Here's a simple list of rules for SparkV.*\n\n> ${ruleDescription}`,
		thumbnail: { url: bot.user.displayAvatarURL() },
		image: { url: "https://www.sparkv.tk/images/banner.gif" },
		color: Colors.Blue,
		timestamp: new Date(),
		footer: {
			text: `SparkV Rules • ${await message.translate("The bot that has everything!")}`,
			iconURL: bot.user.displayAvatarURL()
		}
	});

	/* -------------------------------------------------- SEARCH --------------------------------------------------*/
	if (data.options.getString("search")) {
		const name = data.options.getString("search").toString().toLowerCase();
		const cmd = bot.commands.get(name) || bot.aliases.get(name);
		const category = bot.categories.get(name.charAt(0).toUpperCase() + name.slice(1));

		let embed = new EmbedBuilder().setAuthor({ name: message.user.tag, iconURL: message.user.displayAvatarURL() }).setTimestamp().setColor(Colors.Blue);
		if (cmd) {
			embed
				.setTitle(`\`\`\`/${cmd.settings.name} ${cmd.settings.usage}\`\`\``)
				.setDescription(await message.translate(cmd.settings.description))
				.addFields([
					{
						name: await message.translate("Category"),
						value: await message.translate(`\`\`\`${cmd.category}\`\`\``),
						inline: true
					}, {
						name: await message.translate("Aliases"),
						value: cmd.settings.aliases ? await message.translate(`\`\`\`${cmd.settings.aliases.join(`,\n`)}\`\`\``) : `\`\`\`None.\`\`\``,
						inline: true
					}, {
						name: await message.translate("Cooldown"),
						value: await message.translate(`\`\`\`${cmd.settings.cooldown / 1000} second(s)\`\`\``),
						inline: true
					}, {
						name: await message.translate("Permissions"),
						value: await message.translate(`\`\`\`${cmd.perms ? cmd.perms.join("\n") : "None required."}\`\`\``),
						inline: true
					}
				])
		} else if (category) {
			embed = pages.filter((p: { author: { name: string | any[]; }; }) => p.author.name.includes(category.name))[0];
		} else if (!cmd && !category) {
			embed
				.setTitle(await message.translate("Uh oh!"))
				.setDescription(await message.translate("**The command/category you requested could not be found. Need help? Contact support [here](https://discord.gg/PPtzT8Mu3h).**"))
				.setColor(Colors.Red);
		}

		return await message.replyT({
			embeds: [embed],
			components: [{
				type: 1,
				components: [InviteButton, SupportButton, VoteButton, WebsiteButton]
			}]
		});
	}

	/* -------------------------------------------------- SEND MESSAGE --------------------------------------------------*/
	const helpMessage = await message.replyT({
		embeds: [pages[0]],
		components: [{
			type: 1,
			components: [{
				type: 3,
				customId: "SelectHelpMenu",
				placeholder: await message.translate("Select a page to view more information."),
				options: [{
					label: `${await message.translate("Commands")} [${totalCmds}]`,
					description: "View SparkV's command list.",
					value: "commands",
					emoji: bot.config.emojis.slash
				}, {
					label: `${await message.translate("Stats")}`,
					description: "View SparkV's statistics.",
					value: "stats",
					emoji: bot.config.emojis.stats
				}, {
					label: `${await message.translate("Permissions")}`,
					description: "View SparkV's permissions for the server.",
					value: "permissions",
					emoji: bot.config.emojis.alert
				}, {
					label: `${await message.translate("Rules")}`,
					description: "View SparkV's rules you must follow to use SparkV.",
					value: "rules",
					emoji: bot.config.emojis.ban
				}, {
					label: await message.translate("Menu"),
					description: await message.translate("Return to the main menu."),
					value: "menu",
					emoji: bot.config.emojis.leave
				}]
			}],
		}, {
			type: 1,
			components: [InviteButton, SupportButton, VoteButton, WebsiteButton]
		}],
		fetchReply: true
	});

	/* -------------------------------------------------- HANDLE SELECT MENU --------------------------------------------------*/
	const collector = helpMessage.createMessageComponentCollector({ time: 300 * 1000 });
	collector.on("collect", async (interaction: any) => {
		const page = pages.find((p: any) => p.footer.text.toLowerCase().includes(interaction.values[0].toLowerCase()));
		if (!page) return;

		await interaction.update({
			embeds: [page],
			fetchReply: true
		});
	});
	collector.on("end", async () => {
		try { await helpMessage?.edit({ components: [] }); } catch (err: any) { }
	});
}

export default new cmd(execute, {
	description: `Get help with SparkV, or view SparkV's list of commands.`,
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
