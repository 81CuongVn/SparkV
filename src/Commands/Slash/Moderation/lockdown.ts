import Discord from "discord.js";

const cmd = require("@structures/modCommand");

async function execute(bot: any, message: any, args: string[], command: any, data: any) {
	const state = data.options.getString("state");
	const reason = data.options.getString("reason");

	const embed = new Discord.MessageEmbed()
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
				.setColor("RED");
		} else if (state.toLowerCase() === "off") {
			Channels.forEach(channel => {
				channel.permissionOverwrites.create(message.guild.roles.everyone, {
					SEND_MESSAGES: true
				});
			});

			embed
				.setDescription(`This server is on lockdown! Reason: ${reason}`)
				.setColor("RED");
		} else {
			await message.replyT("Invalid command usage. Please specify a valid state (on/off).");
		}
	} catch (err) {
		message.replyT(`${bot.config.emojis.error} | Failed to put server in lockdown. Please make sure I have the correct permissions.`);
	}
}

export default new cmd(execute, {
	description: "I'll put the server in lockdown, or disable a previous lockdown.",
	dirname: __dirname,
	aliases: [],
	usage: `<on | off>`,
	perms: ["MANAGE_CHANNELS"],
	bot_perms: ["MANAGE_CHANNELS"],
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
