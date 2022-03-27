const fs = require("fs");
const path = require("path");

const logger = require("./logger");

module.exports = {
	/**
   * Update the docs
   * @param {Object} bot The SparkV bot Instance.
   * @param {Dirname} MainDir The main directory.
   */
	update(bot, MainDir) {
		let cmdCount = 0;

		bot.commands.each(() => ++cmdCount);

		let baseText = `# Commands\n\nSparkV's Command List! SparkV contains more than **${cmdCount} commands**!\n`;

		bot.categories
			.filter(cat => {
				if (cat.name.toLowerCase().includes("owner")) return false;

				return true;
			})
			.sort((a, b) => {
				const aCmds = bot.commands.filter(c => {
					if (c) {
						return c.category === a;
					}
				});

				const bCmds = bot.commands.filter(c => {
					if (c) {
						return c.category === b;
					}
				});

				if (aCmds.length > bCmds.length) {
					return -1;
				} else {
					return 1;
				}
			})
			.forEach(cat => {
				const info = [];
				const cmds = bot.commands.filter(cmd => {
					if (cmd) {
						return cmd.category === cat.name;
					}
				});

				if (cat.emoji.includes("<")) {
					baseText += `\n## ${cat.name}\n\n`;
				} else {
					baseText += `\n## ${cat.emoji} ${cat.name}\n\n`;
				}

				info.push(["Name", "Description", "Usage", "Cooldown"]);

				cmds
					.sort((a, b) => {
						if (a.settings.name < b.settings.name) {
							return -1;
						} else {
							return 1;
						}
					})
					.forEach(cmd => {
						info.push([
							`**${cmd.settings.name || "Command name invalid."}**`,
							cmd.settings.description || "No description for this command",
							cmd.settings.usage.replaceAll("<", "(").replaceAll(">", ")") || "",
							`${Math.ceil(cmd.settings.cooldown / 1000)} seconds`,
						]);
					});

				baseText += `${require("markdown-table")(info)}\n`;
			});

		fs.writeFileSync(path.join(`${MainDir}/docs/commands.md`), baseText);
	},
};
