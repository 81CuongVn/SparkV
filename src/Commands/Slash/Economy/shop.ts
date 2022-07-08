import { Colors } from "discord.js";

import cmd from "../../../Structures/command";

export default new cmd(async (bot: any, message: any, args: string[], command: any, data: any) => await message.replyT({
	embeds: [{
		title: `${bot.config.emojis.coin} **Shop**`,
		description: `> Select the item you'd like to buy.\n\n${bot.shop.map((item: any) => `> **${item.emoji ? `${item.emoji} ` : ""}${item.name.charAt(0).toUpperCase() + item.name.slice(1)}** \`[${item.ids.join(", ")}]\` - **⏣${item.price}**\n> ${item.description}`).join("\n\n")}`,
		color: Colors.Blue,
		timestamp: new Date(),
		footer: {
			text: `SparkV Shop • ${bot.config.embed.footer}`,
			icon_url: bot.user.displayAvatarURL()
		}
	}],
	fetchReply: true
}), {
	description: `Displays the shop!`,
	dirname: __dirname,
	usage: "",
	aliases: [],
	perms: [],
	slash: true
});
