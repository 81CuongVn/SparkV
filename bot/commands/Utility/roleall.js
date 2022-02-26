const Discord = require("discord.js");
const canvacord = require("canvacord");

const cmd = require("../../templates/command");

async function execute(bot, message, args, command, data) {
	const role = message?.applicationId ? data.options.getRole("role") : message.mentions.roles.first();

	if (!role) return message.editT("Please mention a valid role to get the id of.");

	await message.guild.members.cache.forEach(async member => await member.roles.add(role));

	await message.editT(`Successfully added the role **${role}** to **${message.guild.members.cache.size}** members.`);
}

module.exports = new cmd(execute, {
	description: "Give all users a role.",
	dirname: __dirname,
	aliases: ["rall"],
	usage: `(@role)`,
	slash: true,
	ephemeral: true,
	options: [
		{
			type: 8,
			name: "role",
			description: "Role to give everyone.",
			required: true
		}
	],
});
