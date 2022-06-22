import Discord from "discord.js";

import cmd from "../../../structures/modCommand";

async function execute(bot: any, message: any, args: string[], command: any, data: any) {
	const emojis = [
		"⬅️",
		bot.config.emojis.arrows.left,
		bot.config.emojis.arrows.right,
		"➡️"
	];

	const User = message?.applicationId ? (data.options.getMember("user") || message.user) : (message.mentions.members.first() || message.author);
	const UserData = (User.user ? User.user.id : User.id) === (message.user ? message.user.id : message.author.id) ? data.member : await bot.database.getMember(User.user ? User.user.id : User.id, message.guild.id);

	if (!User) return await message.replyT(`${bot.config.emojis.error} | Please mention someone to view their warnings!`);
	if (UserData.infractionsCount === 0) return await message.replyT("This user doesn't have any infractions!");

	const infractions = UserData.infractions.sort((a: any, b: any) => b.date - a.date).map((infraction: any) => `**${infraction.type}** - <t:${~~(infraction.date / 1000)}:R>`).join("\n");

	const WarningsArray = infractions.split(`\n`);
	const WarningsSubArray: string[] = [];
	const pages: any[] = [];

	let curLine: number = 0;
	let charCount: number = 0;
	let PageNumber: number = 0;

	for (const line of WarningsArray) {
		if ((charCount + line.length) < 500) {
			WarningsSubArray[curLine] = `${WarningsSubArray[curLine] + line}\n`;
			charCount += line.length;
		} else {
			curLine++;
			charCount = 0;
		}
	}

	WarningsSubArray.map((i: any) => pages.push({
		author: {
			name: (User.user ? User.user : User).tag,
			iconURL: (User.user ? User.user : User).displayAvatarURL({ dynamic: true })
		},
		description: `${bot.config.emojis.warning} **Warnings**\n${User} has **${UserData.infractionsCount}** warning${UserData.infractionsCount > 1 ? "s" : ""}\n\n${i.replaceAll(undefined, "")}`,
		color: bot.config.embed.color,
		timestamp: new Date()
	}));

	const quickLeft = new Discord.MessageButton()
		.setEmoji(emojis[0])
		.setCustomId("quickLeft")
		.setStyle("SECONDARY");

	const left = new Discord.MessageButton()
		.setEmoji(emojis[1])
		.setCustomId("left")
		.setStyle("SECONDARY");

	const right = new Discord.MessageButton()
		.setEmoji(emojis[2])
		.setCustomId("right")
		.setStyle("SECONDARY");

	const quickRight = new Discord.MessageButton()
		.setEmoji(emojis[3])
		.setCustomId("quickRight")
		.setStyle("SECONDARY");

	const msg = await message.replyT({
		embeds: [pages[0]],
		components: UserData.infractionsCount >= 100 ? [new Discord.MessageActionRow().addComponents(quickLeft, left, right, quickRight)] : [],
		fetchReply: true
	});

	if (UserData.infractionsCount >= 100) {
		const collector = msg.createMessageComponentCollector({ time: 300 * 1000 });
		collector.on("collect", async (interaction: any) => {
			if (interaction.customId === "quickLeft") PageNumber = 0;
			else if (interaction.customId === "left") PageNumber > 0 ? --PageNumber : PageNumber = (pages.length - 1);
			else if (interaction.customId === "right") (PageNumber + 1) < pages.length ? ++PageNumber : PageNumber = 0;
			else if (interaction.customId === "quickRight") PageNumber = pages.length - 1;

			try {
				interaction.update({
					embeds: [
						pages[PageNumber].setFooter({ text: `Page ${PageNumber + 1}/${pages.length}` })
					]
				});
			} catch (err: any) { }
		});
	}
}

export default new cmd(execute, {
	description: `I'll display a user's warnings.`,
	dirname: __dirname,
	aliases: ["infractions"],
	usage: `(user)`,
	perms: ["MODERATE_MEMBERS"],
	bot_perms: ["MODERATE_MEMBERS"],
	slash: true,
	options: [
		{
			type: 6,
			name: "user",
			description: "The user to display the warnings of."
		}
	]
});
