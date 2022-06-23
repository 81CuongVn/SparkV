import Discord from "discord.js";
import axios from "axios";
import os from "os";

import cmd from "../../../structures/command";

async function execute(bot: any, message: any, args: string[], command: any, data: any) {
	switch (data.options.getString("type")) {
		case "stats": {
			const BotMessage = await message.replyT({
				embeds: [{
					author: {
						name: message.user.tag,
						iconURL: message.user.displayAvatarURL({ dynamic: true })
					},
					title: await message.translate(`${bot.config.emojis.config} | Loading stats...`),
					description: await message.translate(`Please wait while I load my statistics...`),
					color: bot.config.embed.color,
					timestamp: new Date()
				}],
				fetchReply: true
			});

			const statcord = await axios.get(`https://api.statcord.com/v3/${bot.user.id}`).then((res: any) => res.data.data[0]).catch((): any => { });
			// RamData = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}/${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)
			await BotMessage.edit({
				embeds: [{
					author: {
						name: message.user.tag,
						iconURL: message.user.displayAvatarURL({ dynamic: true })
					},
					fields: [
						{
							name: `**${await message.translate("Server")}**`,
							value: `${bot.config.emojis.rocket} ${await message.translate("CPU")}: **${statcord.cpuload}%**\n${bot.config.emojis.stats} Memory: **${(((os.totalmem() - os.freemem()) / (os.totalmem())) * 100).toFixed(2)}%**\n${bot.config.emojis.clock} Uptime: **${bot.functions.MSToTime(bot.uptime, "short")}**`,
							inline: true
						},
						{
							name: `**${await message.translate("Bot Statistics")}**`,
							value: `${bot.config.emojis.globe} ${await message.translate("Servers")}: **${bot.functions.formatNumber(await bot.functions.GetServerCount())}**\n${bot.config.emojis.player} Users: **${bot.functions.formatNumber(await bot.functions.GetUserCount())}**`,
							inline: true
						}
					],
					image: {
						url: `https://dblstatistics.com/bot/${bot.user.id}/widget/servers?width=1500&height=700&titleFontSize=20&labelFontSize=40&fillColor=0a1227?&lineColor=4752cc&backgroundColor=00000000`
					},
					footer: {
						text: `A special thanks to waya.one for some design ideas shown above.`,
						iconURL: bot.user.displayAvatarURL({ dynamic: true })
					},
					color: bot.config.embed.color,
					timestamp: new Date()
				}]
			});
			break;
		} case "permissions": {
			const requiredPerms = [
				"KICK_MEMBERS",
				"BAN_MEMBERS",
				"MANAGE_CHANNELS",
				"MANAGE_GUILD",
				"ADD_REACTIONS",
				"VIEW_CHANNEL",
				"SEND_MESSAGES",
				"MANAGE_MESSAGES",
				"EMBED_LINKS",
				"ATTACH_FILES",
				"READ_MESSAGE_HISTORY",
				"USE_EXTERNAL_EMOJIS",
				"CONNECT",
				"SPEAK",
				"MANAGE_NICKNAMES",
				"MANAGE_ROLES"
			];

			let description = "";
			Object.keys(Discord.Permissions.FLAGS).forEach(perm => {
				if (requiredPerms.filter(p => p === perm).length > 0) {
					if (message.channel.permissionsFor(message.guild.me).has(perm)) description += `${bot.config.emojis.success} ${perm}\n`;
					else description += `${bot.config.emojis.error} ${perm}\n`;
				}
			});

			await message.replyT({
				embeds: [{
					author: {
						name: message.user.tag,
						iconURL: message.user.displayAvatarURL({ dynamic: true })
					},
					description,
					thumbnail: { url: message.guild.iconURL({ dynamic: false, format: "png" }) },
					footer: {
						text: `SparkV's permissions in this server. • ${bot.config.embed.footer}`,
						iconURL: bot.user.displayAvatarURL()
					},
					color: bot.config.embed.color,
					timestamp: new Date()
				}]
			});

			break;
		} case "rules": {
			const rules = [
				"No Automation. Using automation (Ex: auto-typers) is forbidden. Using automation (and with found proof) will cause a wipe of your data and a ban from using SparkV.",
				"No spamming commands. Spamming SparkV's commands will result with a warning. If continued, a complete wipe of your data and a ban from SparkV will be given to you.",
				"No using alternate accounts to earn yourself money. If proof is found, your data will be wiped and you will be banned from SparkV."
			];

			let description = "";
			let number = 0;
			rules.forEach(rule => {
				number++;
				description += `**${number}.** ${rule}\n`;
			});

			await message.replyT({
				embeds: [{
					author: {
						name: message.user.tag,
						iconURL: message.user.displayAvatarURL({ dynamic: true })
					},
					description: `**Rules**\n*Here's a simple list of rules for SparkV.*\n\n${description}`,
					color: bot.config.embed.color,
					timestamp: new Date()
				}]
			});

			break;
		} case "website": {
			await message.replyT({
				embeds: [{
					author: {
						name: message.user.tag,
						iconURL: message.user.displayAvatarURL({ dynamic: true })
					},
					description: `**Hi, ${message.user.tag}!**\nClick [${await message.translate("here")}](https://${process.env.BASEURL}/) to view my website.`,
					color: "GREEN",
					timestamp: new Date()
				}]
			});
		}
	}
}

export default new cmd(execute, {
	description: "View Information for SparkV (Stats/Permissions/Rules/Website).",
	dirname: __dirname,
	usage: "",
	aliases: [],
	perms: [],
	slash: true,
	options: [
		{
			type: 3,
			name: "type",
			description: "The type of information you want to get about the bot.",
			required: true,
			choices: [
				{
					name: "stats",
					value: "stats"
				},
				{
					name: "permissions",
					value: "permissions"
				},
				{
					name: "rules",
					value: "rules"
				},
				{
					name: "website",
					value: "website"
				}
			]
		}
	]
}
);
