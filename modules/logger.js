const { withScope, captureException, Severity } = require("@sentry/node");
const chalk = require("chalk");

const config = require("../globalconfig.json");

module.exports = async (content, type = "log") => {
	if (!content) return;

	if (type === "log") {
		return console.log(`📋 | ${content}`);
	} else if (type === "warn") {
		await withScope(scope => {
			scope.setLevel(Severity.Warning);
		});

		if (process.argv.includes("--dev") === false) {
			try {
				await captureException(content);
			} catch (err) {
				console.log(`⛔ | Failed to capture exception warning (${content}) to Sentry. ${err}`);
			}
		}

		return console.log(`⚠ | ${chalk.yellow(content)}`);
	} else if (type === "debug") {
		return console.log(`🐛 | ${chalk.green(content)}`);
	} else if (type === "error") {
		await withScope(scope => {
			scope.setLevel(Severity.Error);
		});

		if (process.argv.includes("--dev") === false) {
			try {
				await captureException(content);
			} catch (err) {
				console.log(`⛔ | Failed to capture exception (${content}) to Sentry. ${err}`);
			}
		}

		return console.log(`⛔ | ${chalk.red(content)}`);
	} else if (type === "bot") {
		return console.log(`🤖 | ${content}`);
	} else if (type === "web") {
		return console.log(`🖼 | ${content}`);
	} else {
		return console.log(`⚠ | Wrong type of logger. Expected: log, warn, error, bot, or web. Instead, got ${type}.`);
	}
};
