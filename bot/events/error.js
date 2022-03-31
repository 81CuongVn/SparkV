const Discord = require("discord.js");
const logger = require("@modules/logger");

module.exports = {
	once: false,
	async execute(bot, event) {
		await logger(`Discord bot error. ${event}`, "error");
	},
};
