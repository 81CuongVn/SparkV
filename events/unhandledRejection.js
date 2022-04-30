const Discord = require("discord.js");
const logger = require("@modules/logger");

exports.run = async error => {
	// Cannot find the message
	if (error.code === Discord.Constants.APIErrors.UNKNOWN_MESSAGE) return;

	await logger(`Unhandled rejection error. ${error}.`, "error");
};
