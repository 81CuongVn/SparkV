const discord = require("discord.js");
const NewCommand = require("./command");

module.exports = class ModCommand {
	constructor(execute, sett) {
		this.execute = execute;
		this.settings = new NewCommand(execute, Object.assign({ cooldown: 2 * 1000 }, sett)).settings;
	}

	async run(bot, message, args, command, data) {
		return this.execute(bot, message, args, command, data);
	}
};
