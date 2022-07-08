import Discord, { Colors } from "discord.js";
import chalk from "chalk";

interface moreData {
	data?: {
		name?: string;
		stack?: string;
		path?: string;
	};
	interaction?: Discord.Interaction;
}

export default async (content: string, type?: string, moreData?: moreData) => {
	if (!content) return;

	switch (type) {
		case "log": {
			console.log(`[Info] ${content}`);
			break;
		} case "warn": {
			console.log(chalk.yellow(`[Warning] ${content}`));
			break;
		} case "debug": {
			console.log(chalk.green(`[Debug] ${content}`));
			break;
		} case "error": {
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

				const errorChannel: any = await bot.channels.fetch("948686231892545547");
				if (errorChannel) {
					let embed = {
						title: `${(moreData?.data?.name || content) ?? "Error"}`,
						description: `**An error occured!**`,
						fields: [{
							name: "**Error**",
							value: `\`\`\`${content}\`\`\``
						}],
						color: Colors.Red,
						timestamp: new Date()
					}
					moreData?.data?.stack && embed.fields.push({ name: "**Stack**", value: `\`\`\`${moreData?.data.stack}\`\`\`` });

					await errorChannel.send({ embeds: [embed] });
				}
			}
			break;
		} case "bot": {
			console.log(`[App] | ${content}`);
			break;
		} case "web": {
			console.log(`[Web] | ${content}`);
			break;
		} default: { console.log(content); }
	}
};
