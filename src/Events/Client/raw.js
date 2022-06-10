const Discord = require("discord.js");

const logger = require("@utils/logger");

module.exports = {
	once: false,
	async execute(bot, event) {
		bot.music.updateVoiceState(event);
	}
};
