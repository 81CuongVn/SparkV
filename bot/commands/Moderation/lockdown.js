const Discord = require("discord.js");

const cmd = require("@templates/modCommand");

async function execute(bot, message, args, command, data) {
	const state = data.options.getString("state");
	const reason = data.options.getString("reason");

	const embed = new Discord.EmbedBuilder()
		.setAuthor({
			name: (message?.user ? message.user : message.author).tag,
			iconURL: (message?.user ? message.user : message.author).displayAvatarURL({ dynamic: true })
		})
		.setFooter({
			text: bot.config.embed.footer,
			iconURL: bot.user.displayAvatarURL({ dynamic: true })
		});

	const Channels = message.guild.channels.cache.filter(channel => channel.type !== "GUILD_CATEGORY");

	try {
		if (state.toLowerCase() === "on") {
			Channels.forEach(Channel => {
				Channel.permissionOverwrites.create(message.guild.roles.everyone, {
					SEND_MESSAGES: false
				});
			});

			embed
				.setDescription(`This server is on lockdown! Reason: ${reason}`)
				.setColor("#ED4245");
		} else if (state.toLowerCase() === "off") {
			Channels.forEach(channel => {
				channel.permissionOverwrites.create(message.guild.roles.everyone, {
					SEND_MESSAGES: true
				});
			});

			embed
				.setDescription(`This server is on lockdown! Reason: ${reason}`)
				.setColor("#ED4245");
		} else {
			await message.replyT("Invalid command usage. Please specify a valid state (on/off).");
		}
	} catch (err) {
		message.replyT(`${bot.config.emojis.error} | Failed to put server in lockdown. Please make sure I have the correct permissions.`);
	}
}

module.exports = new cmd(execute, {
	description: "I'll put the server in lockdown, or disable a previous lockdown.",
	dirname: __dirname,
	aliases: [],
	usage: `<on | off>`,
	perms: ["ManageChannels"],
	bot_perms: ["ManageChannels"],
	slash: true,
	options: [
		{
			type: 3,
			name: "state",
			description: "The state of the lockdown. (on/off)",
			required: true,
			choices: [
				{
					name: "on",
					value: "on"
				},
				{
					name: "off",
					value: "off"
				}
			]
		},
		{
			type: 3,
			name: "reason",
			description: "Reason for locking the server."
		}
	]
});
