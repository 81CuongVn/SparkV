const Discord = require("discord.js");
const { withScope, captureException, Severity } = require("@sentry/node");
const chalk = require("chalk");

module.exports = async (content, type) => {
	if (!content) return;

	if (type === "log") {
		return console.log(`[Info] ${content}`);
	} else if (type === "warn") {
		if (process.argv.includes("--dev") === false) {
			try {
				await withScope(scope => scope.setLevel(Severity.Warning));
				await captureException(content);
			} catch (err) {
				console.log(`[Sentry Error] | Failed to capture exception warning (${content}) to Sentry. ${err}`);
			}
		}

		return console.log(chalk.yellow(`[Warning] ${content}`));
	} else if (type === "debug") {
		return console.log(chalk.green(`[Debug] ${content}`));
	} else if (type === "error") {
		if (process.argv.includes("--dev") === false) {
			try {
				await withScope(scope => scope.setLevel(Severity.Error));
				await captureException(content);
			} catch (err) {
				console.log(`[ERROR] Failed to capture exception (${content}) to Sentry. ${err}`);
			}

			if (global?.bot?.isReady() === true) {
				const errorChannel = await global.bot.channels.fetch("948686231892545547");

				if (errorChannel) {
					const ErrorEmbed = new Discord.MessageEmbed()
						.setTitle("Uh oh!")
						.setDescription(`**An error occured!**`)
						.addField("**Error**", `\`\`\`${content}\`\`\``)
						.setColor("RED");

					if (content?.stack) ErrorEmbed.addField("**Stack**", `\`\`\`${content.stack}\`\`\``);

					await errorChannel.send({
						embeds: [ErrorEmbed],
					});
				}
			}
		}

		return console.log(`[Error] ${chalk.red(process.argv.includes("--dev") === true ? (content?.stack || content) : content)}`);
	} else if (type === "bot") {
		return console.log(`[App] | ${content}`);
	} else if (type === "web") {
		return console.log(`[Web] | ${content}`);
	} else {
		return console.log(content);
	}
};
