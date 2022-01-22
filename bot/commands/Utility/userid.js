const Discord = require("discord.js");
const canvacord = require("canvacord");

const cmd = require("../../templates/command");

async function execute(bot, message, args, command, data) {
	const user = message?.applicationId ? data.options.getMember("user") || message.user : (await bot.functions.fetchUser(args[0]) || message.author);

	if (!user) return await message.replyT("Please mention a user to get the id of.");

	return await message.replyT(`The id of **${user.user ? user.user.tag : user.tag}** is **${user.user ? user.user.id : user.id}**.`);
}

module.exports = new cmd(execute, {
	description: "I will get the ID of the mentioned user. If you don't menion a user, I'll get your ID instead.",
	dirname: __dirname,
	aliases: ["uid", "id"],
	usage: `(optional: @member default: you)`,
	slash: true,
	requireArgs: true,
	options: [
		{
			type: 6,
			name: "user",
			description: "The user to get the ID of.",
		}
	]
});
