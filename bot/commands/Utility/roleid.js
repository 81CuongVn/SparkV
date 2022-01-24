const Discord = require("discord.js");
const canvacord = require("canvacord");

const cmd = require("../../templates/command");

async function execute(bot, message, args, command, data) {
	const role = message?.applicationId ? data.options.getRole("role") : message.mentions.roles.first();

	if (!role) return message.replyT("Please mention a valid role to get the id of.");

	await message.replyT(`The id of the role **${role.name}** is **${role.id}**.`);
}

module.exports = new cmd(execute, {
	description: "Grab the ID of any role!",
	dirname: __dirname,
	aliases: ["rid"],
	usage: `(@role)`,
	slash: true,
	slashOnly: true,
	options: [
		{
			type: 8,
			name: "role",
			description: "Role to get the ID of.",
			required: true
		}
	]
});
