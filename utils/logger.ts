import Discord from "discord.js";
import chalk from "chalk";

interface moreData {
	data: {
		name: string;
		stack: string;
		path: string;
	};
	interaction: Discord.Interaction;
}

export default async (content: string, type?: string, moreData?: moreData) => {
	if (!content) return;

	switch (type) {
		case "log":
			return console.log(`[Info] ${content}`);
		case "warn":
			return console.log(chalk.yellow(`[Warning] ${content}`));
		case "debug":
			return console.log(chalk.green(`[Debug] ${content}`));
		case "error":
			console.log(`[Error] ${chalk.red(process.argv.includes("--dev") === true ? (moreData?.data?.stack || content) : content)}`);

			const bot: Discord.Client = (global as any).bot;
			if (process.argv.includes("--dev") === false && bot?.isReady() === true) {
				// const date: Date = new Date();
				// const data = {
				// 	id: Buffer.from((date.getTime()).toString()).toString("base64"),
				// 	error: {
				// 		path: moreData?.data?.path ?? "N/A",
				// 		code: content?.toString()
				// 	},
				// 	data: {
				// 		date,
				// 		timestamp: date.getTime(),
				// 		command: moreData?.interaction ? moreData?.interaction?.commandName?.toLowerCase() || moreData?.interaction?.customId : "N/A",
				// 		user: moreData?.interaction?.user?.id || "N/A"
				// 	}
				// };

				const errorChannel: Discord.TextChannel = await bot.channels.fetch("948686231892545547");
				if (errorChannel) {
					const ErrorEmbed = new Discord.MessageEmbed()
						.setTitle(`${(moreData?.data?.name || content) ?? "Error"}`)
						.setDescription(`**An error occured!**`)
						.addField("**Error**", `\`\`\`${content}\`\`\``)
						.setColor("RED");

					if (moreData?.data?.stack) ErrorEmbed.addField("**Stack**", `\`\`\`${moreData?.data.stack}\`\`\``);

					await errorChannel.send({
						embeds: [ErrorEmbed]
					});
				}
			}
		case "bot":
			return console.log(`[App] | ${content}`);
		case "web":
			return console.log(`[Web] | ${content}`);
		default:
			return console.log(content);
	}
};
