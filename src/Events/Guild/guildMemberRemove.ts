import Discord, { GuildMember, TextChannel } from "discord.js";
import path from "path";

import database from "../../Database/handler";

export default {
	once: false,
	async execute(bot: any, member: GuildMember) {
		const data = await database.getGuild(member.guild.id);
		if (data.goodbye.enabled === "false") return;

		const channel: any | undefined | null = member?.guild?.channels?.cache.get(data.goodbye?.channel) as TextChannel;
		if (!channel) return;

		const image = await bot.functions.createCard({
			user: member.user,
			text: {
				title: "Goodbye!",
				desc: "We hope to see you again soon!",
				footer: `You're our ${member.guild.memberCount}${member.guild.memberCount === 1 ? "st" : (member.guild.memberCount === 2 ? "nd" : (member.guild.memberCount >= 3 ? "th" : "th"))} member!`
			}
		});

		const attachment = new Discord.MessageAttachment(image.toBuffer(), `Goodbye-${member.user.tag}.png`);
		const msg = data.goodbye.message
			.replaceAll("{mention}", `${member}`)
			.replaceAll("{tag}", `${member.user.tag}`)
			.replaceAll("{username}", `${member.user.username}`)
			.replaceAll("{server}", `${member.guild.name}`)
			.replaceAll("{members}", `${bot.functions.formatNumber(member.guild.memberCount)}`);

		channel.send({
			content: msg,
			files: [attachment],
		}).catch((): any => {});
	},
};
