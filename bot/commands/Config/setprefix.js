const Discord = require(`discord.js`);

const cmd = require("../../templates/command");
const database = require("../../../database/handler");

async function execute(bot, message, args, command, data) {
	const prefix = data.options.getString("prefix");

	if (!prefix) return await message.replyT("You need to provide a valid **prefix**.");
	if (prefix.length > 5) return await message.replyT("You need to provide a prefix **UNDER** `5` characters.");

	const gdata = await database.getGuild(message.guild.id);

	gdata.prefix = prefix.trim();
	gdata.markModified("prefix");

	await gdata.save();

	return await message.replyT(`The prefix is now **\`${prefix}\`**`);
}

module.exports = new cmd(execute, {
	description: `Changes the prefix.`,
	dirname: __dirname,
	usage: "(prefix limit: 5 chars)",
	aliases: [],
	perms: ["MANAGE_MESSAGES"],
	slash: true,
	slashOnly: true,
	options: [
		{
			type: 3,
			name: "prefix",
			description: "The prefix to change to. Default: ^",
			required: true
		}
	]
});
