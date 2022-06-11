const Discord = require("discord.js");
const chalk = require("chalk");

module.exports = async (content, type, moreData) => {
	if (!content) return;

	if (type === "log") {
		return console.log(`[Info] ${content}`);
	} else if (type === "warn") {
		if (process.argv.includes("--dev") === false) {

		}

		return console.log(chalk.yellow(`[Warning] ${content}`));
	} else if (type === "debug") {
		return console.log(chalk.green(`[Debug] ${content}`));
	} else if (type === "error") {
		console.log(`[Error] ${chalk.red(process.argv.includes("--dev") === true ? (moreData?.data?.stack || content) : content)}`);

		if (process.argv.includes("--dev") === false && global?.bot?.isReady() === true) {
			const date = new Date();
			const data = {
				id: Buffer.from((date.getTime()).toString()).toString("base64"),
				error: {
					path: moreData?.data?.path ?? "N/A",
					code: content?.toString()
				},
				data: {
					date,
					timestamp: date.getTime(),
					command: moreData?.interaction ? moreData?.interaction?.commandName?.toLowerCase() || moreData?.interaction?.customId : "N/A",
					user: moreData?.interaction?.user?.id || "N/A"
				}
			};
			console.log(data);

			const errorChannel = await global.bot.channels.fetch("948686231892545547");
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
	} else if (type === "bot") {
		return console.log(`[App] | ${content}`);
	} else if (type === "web") {
		return console.log(`[Web] | ${content}`);
	} else {
		return console.log(content);
	}
};
