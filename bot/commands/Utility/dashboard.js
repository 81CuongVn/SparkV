const Discord = require(`discord.js`);

const cmd = require("../../templates/command");


module.exports = new cmd(async (bot, message) => await message.replyT(`${bot.config.emojis.success} | Click the following link to view my dashboard! https://dashboard.sparkv.tk/`), {
	description: `I'll send my dashboard!`,
	dirname: __dirname,
	aliases: ["dash"],
	usage: `<user>`,
	slash: true
});
