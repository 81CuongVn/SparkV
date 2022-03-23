const Discord = require("discord.js");
const canvacord = require("canvacord");

const cmd = require("../../templates/command");

async function execute(bot, message, args, command, data) {
	const state = message.options.getSubcommand();

	if (state === "user") {
		const user = data.options.getMember("user") || message.user;

		return await message.editT(`The id of **${user.user ? user.user.tag : user.tag}** is **${user.user ? user.user.id : user.id}**.`);
	} else if (state === "server") {
		const server = data.options.getString("server");

		return await message.editT(`The id of **${user.user ? user.user.tag : user.tag}** is **${user.user ? user.user.id : user.id}**.`);
	} else if (state === "role") {
		const role = data.options.getRole("role");

		await message.editT(`The id of the role **${role}** is **${role.id}**.`);
	} else if (state === "channel") {
		const channel = data.options.getChannel("channel");

		await message.editT(`The id of the channel **${channel}** is **${channel.id}**.`);
	}
}

module.exports = new cmd(execute, {
	description: "Grab the ID of the server or a user.",
	dirname: __dirname,
	aliases: ["rid", "uid", "id"],
	usage: "(type (user/server/role/channel)) (user/invite/role/channel)",
	slash: true,
	slashOnly: true,
	ephemeral: true,
	options: [
		{
			type: 1,
			name: "user",
			description: "Grab a user's id.",
			options: [
				{
					type: 6,
					name: "user",
					description: "The user of who you want to get the id of. Default: You."
				}
			]
		},
		{
			type: 1,
			name: "server",
			description: "Grab a server's id.",
			options: [
				{
					type: 3,
					name: "invite",
					description: "The Invite for the server you want to get the server id of. Default: current server."
				}
			]
		},
		{
			type: 1,
			name: "role",
			description: "Grab a role's id.",
			options: [
				{
					type: 8,
					name: "role",
					description: "THe role to get the ID of.",
					required: true
				}
			]
		},
		{
			type: 1,
			name: "channel",
			description: "Grab a channel's id.",
			options: [
				{
					type: 7,
					name: "channel",
					description: "The channel to get the ID of.",
					required: true
				}
			]
		}
	]
});