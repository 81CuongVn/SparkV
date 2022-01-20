const Discord = require(`discord.js`);

const cmd = require("../../templates/command");
const database = require("../../../database/handler");

async function execute(bot, message, args, command) {
	if (!args[0]) {
		return await message.replyT("You need to provide a **prefix**.");
	}

	if (args[0].length > 5) {
		return await message.replyT("You need to provide a prefix **UNDER** `5` characters.");
	}

	const data = await database.getGuild(message.guild.id);

	data.prefix = args.join(" ").trim();
	data.markModified("prefix");

	await data.save();

	return await message.replyT(`The prefix is now **\`${args[0]}\`**`);
}

module.exports = new cmd(execute, {
	description: `Changes the prefix.`,
	dirname: __dirname,
	usage: "",
	aliases: [],
	perms: ["MANAGE_MESSAGES"],
});
