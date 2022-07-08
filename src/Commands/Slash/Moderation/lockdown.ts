import Discord, { ChannelType, Colors } from "discord.js";

import cmd from "../../../Structures/modCommand";

async function execute(bot: any, message: any, args: string[], command: any, data: any) {
	const state = data.options.getString("state");
	const reason = data.options.getString("reason");

	const embed = new Discord.EmbedBuilder()
		.setAuthor({
			name: message.user.tag,
			iconURL: message.user.displayAvatarURL()
		})
		.setFooter({
			text: bot.config.embed.footer,
			iconURL: bot.user.displayAvatarURL()
		});

	const Channels = message.guild.channels.cache.filter((channel: any) => channel.type !== ChannelType.GuildCategory);

	try {
		if (state.toLowerCase() === "on") {
			Channels.forEach((channel: any) => {
				channel.permissionOverwrites.create(message.guild.roles.everyone, {
					SEND_MESSAGES: false
				});
			});

			embed
				.setDescription(`This server is on lockdown! Reason: ${reason}`)
				.setColor(Colors.Red);
		} else if (state.toLowerCase() === "off") {
			Channels.forEach((channel: any) => {
				channel.permissionOverwrites.create(message.guild.roles.everyone, {
					SEND_MESSAGES: true
				});
			});

			embed
				.setDescription(`This server is on lockdown! Reason: ${reason}`)
				.setColor(Colors.Red);
		} else {
			await message.replyT("Invalid command usage. Please specify a valid state (on/off).");
		}
	} catch (err: any) {
		message.replyT(`${bot.config.emojis.error} | Failed to put server in lockdown. Please make sure I have the correct permissions.`);
	}
}

export default new cmd(execute, {
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
