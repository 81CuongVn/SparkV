const Discord = require("discord.js");
const canvacord = require("canvacord");

const cmd = require("../../templates/command");

async function execute(bot, message, args, command, data) {
	const state = message.options.getSubcommand();

	if (state === "user") {
		const user = data.options.getUser("user") || message.user;

		return await message.editT(`The id of **${user.tag}** is **${user.id}**.`);
	} else if (state === "server") {
		let server = data.options.getString("server");

		if (server) {
			invite = invite.match(/(?:https?:\/\/)?(?:\w+\.)?discord(?:(?:app)?\.com\/invite|\.gg)\/([A-Za-z0-9-]+)/);

			let fixedInvite;
			if (!invite?.[0]) fixedInvite = invite;
			else fixedInvite = invite[1];

			if (!fixedInvite) return await message.replyT("Please enter a valid invite.");

			const serverinfo = await axios
				.get(`https://discord.com/api/v8/invites/${fixedInvite}?with_counts=1&with_expiration=1`)
				.then(res => res.data);

			if (serverinfo.code === 400) return message.replyT("Invalid invite.");

			server = serverinfo?.guild;
		} else {
			server = message?.guild;
		}

		return await message.editT(`The id of **${server.name}** is **${server.id}**.`);
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
