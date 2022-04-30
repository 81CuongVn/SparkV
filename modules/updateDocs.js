const fs = require("fs");
const path = require("path");

const logger = require("./logger");

// A special thanks to markdown-table for this awesome code.
// https://github.com/wooorm/markdown-table/
// They switched to ESM only, so I can no longer use their package.
function markdown(table) {
	var minCellSize = 3;
	var dotRe = /\./;
	let cellCount = 0;
	let rowIndex = -1;
	const rowLength = table.length;
	let sizes = [];
	const alignment = [];
	let align;
	let rule;
	let rows;
	let row;
	let cells;
	let index;
	let position;
	let size;
	let value;
	let spacing;
	let before;
	let after;

	while (++rowIndex < rowLength) {
		row = table[rowIndex];

		index = -1;

		if (row.length > cellCount) {
			cellCount = row.length;
		}

		while (++index < cellCount) {
			position = row[index] ? dotindex(row[index]) : null;

			if (!sizes[index]) {
				sizes[index] = minCellSize;
			}

			if (position > sizes[index]) {
				sizes[index] = position;
			}
		}
	}

	// Make sure only valid alignments are used.
	index = -1;

	while (++index < cellCount) {
		align = alignment[index];

		if (typeof align === "string") {
			console.log("funny string");
			align = align.charAt(0).toLowerCase();
		}

		if (
			align !== "l" &&
			align !== "r" &&
			align !== "c" &&
			align !== "."
		) {
			align = "";
		}

		alignment[index] = align;
	}

	rowIndex = -1;
	rows = [];

	while (++rowIndex < rowLength) {
		row = table[rowIndex];

		index = -1;
		cells = [];

		while (++index < cellCount) {
			value = row[index];

			value = stringify(value);

			if (alignment[index] === ".") {
				position = dotindex(value);

				size =
					sizes[index] +
					(dotRe.test(value) ? 0 : 1) -
					(String(value).length - position);

				cells[index] = value + pad(size - 1);
			} else {
				cells[index] = value;
			}
		}

		rows[rowIndex] = cells;
	}

	sizes = [];
	rowIndex = -1;

	while (++rowIndex < rowLength) {
		cells = rows[rowIndex];

		index = -1;

		while (++index < cellCount) {
			value = cells[index];

			if (!sizes[index]) {
				sizes[index] = minCellSize;
			}

			size = String(value).length;

			if (size > sizes[index]) {
				sizes[index] = size;
			}
		}
	}

	rowIndex = -1;

	while (++rowIndex < rowLength) {
		cells = rows[rowIndex];

		index = -1;

		while (++index < cellCount) {
			value = cells[index];

			position = sizes[index] - (String(value).length || 0);
			spacing = pad(position);

			if (alignment[index] === "r" || alignment[index] === ".") {
				value = spacing + value;
			} else if (alignment[index] === "c") {
				position /= 2;

				if (position % 1 === 0) {
					before = position;
					after = position;
				} else {
					before = position + 0.5;
					after = position - 0.5;
				}

				value = pad(before) + value + pad(after);
			} else {
				value += spacing;
			}

			cells[index] = value;
		}

		rows[rowIndex] = cells.join(" | ");
	}

	index = -1;
	rule = [];

	while (++index < cellCount) {
		// When `pad` is false, make the rule the same size as the first row.
		spacing = sizes[index];
		align = alignment[index];

		// When `align` is left, don't add colons.
		value = align === "r" || align === "" ? "-" : ":";
		value += pad(spacing - 2, "-");
		value += align !== "l" && align !== "" ? ":" : "-";

		rule[index] = value;
	}

	rows.splice(1, 0, rule.join(" | "));
	return `| ${rows.join(" |\n| ")}" |`;
}

function stringify(value) {
	return value === null || value === undefined ? "" : String(value);
}

function pad(length, character) {
	return new Array(length + 1).join(character || " ");
}

function dotindex(value) {
	var match = /\.[^.]*$/.exec(value);

	return match ? match.index + 1 : value.length;
}

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
		let cmdTable = {};

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

				if (!cmdTable[cat.name]) cmdTable[cat.name] = [];

				cmds
					.sort((a, b) => {
						if (a.settings.name < b.settings.name) {
							return -1;
						} else {
							return 1;
						}
					})
					.forEach(cmd => {
						cmdTable[cat.name].push({
							name: cmd.settings.name || "Untitled Command",
							description: cmd.settings.description || "There is no description provided for this command.",
							usage: cmd.settings.usage.replaceAll("<", "(").replaceAll(">", ")") || "",
							cooldown: `${Math.ceil(cmd.settings.cooldown / 1000)} seconds`
						});

						info.push([
							`**${cmd.settings.name || "Untitled Command"}**`,
							cmd.settings.description || "No description for this command.",
							cmd.settings.usage.replaceAll("<", "(").replaceAll(">", ")") || "",
							`${Math.ceil(cmd.settings.cooldown / 1000)} seconds`
						]);
					});

				baseText += `${markdown(info)}\n`;
			});

		fs.writeFileSync(path.join(`${MainDir}/docs/commands.md`), baseText);
		fs.writeFileSync(path.join(`${MainDir}/docs/commandsdata.json`), JSON.stringify(cmdTable));
	}
};
