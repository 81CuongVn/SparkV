const Discord = require("discord.js");
const canvacord = require("canvacord");

const cmd = require("@templates/command");

async function execute(bot, message, args, command, data) {
	const role = data.options.getRole("role");

	try {
		await message.guild.members.cache.forEach(async member => await member.roles.add(role).catch(async err => await message.editT(`Failed to give **${role}**. Please check my permissions and try again.`)));

		await message.editT(`Successfully added the role **${role}** to **${message.guild.members.cache.size}** members.`);
	} catch (err) {
		await message.editT(`Failed to give **${role}**. Please check my permissions and try again.`);
	}
}

module.exports = new cmd(execute, {
	description: "Give all users a role.",
	dirname: __dirname,
	aliases: ["rall"],
	perms: ["ManageRoles"],
	bot_perms: ["ManageRoles"],
	usage: `(@role)`,
	slash: true,
	slashOnly: true,
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
