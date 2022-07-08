import Discord, { Colors } from "discord.js";

import cmd from "../../../structures/command";

async function execute(bot: any, message: any, args: string[], command: any, data: any) {
	const state = message.options.getSubcommand();
	const embed = new Discord.EmbedBuilder()
		.setAuthor({
			name: message.user.tag,
			iconURL: message.user.displayAvatarURL()
		})
		.setColor(Colors.Green)
		.setTimestamp();

	if (state === "create") {
		const name = message.options.getString("name");
		const content = message.options.getString("content");

		data.guild.tags.push({
			name,
			content: content.replace("<br>", "\n")
		});
		data.guild.markModified("tags");
		await data.guild.save();

		embed.setDescription(`**Tag Created**\nSuccessfully created a new tag called **${name}**.`);
	} else if (state === "view") {
		const name = message.options.getString("name");

		const tag = data.guild.tags.find((t: any) => t.name.toLowerCase() === name.toLowerCase());
		if (!tag) return await message.editT(`${bot.config.emojis.error} | That tag doesn't exist!`);

		embed.setDescription(`**${tag.name}**\n${tag.content.replace("<br>", "\n")}`).setColor(Colors.Blue);
	} else if (state === "list") {
		if (data.guild?.tags?.length < 1) return await message.editT(`${bot.config.emojis.error} | There are no tags for this server!`);

		embed.setDescription(`**Server Tags**\n${data.guild?.tags.map((tag: any) => tag.name).setColor(Colors.Blue)}`);
	} else if (state === "delete") {
		const name = message.options.getString("name");
		const tag = data.guild.tags.find((tag: any) => tag.name.toLowerCase() === name.toLowerCase());

		if (!tag) return await message.editT(`${bot.config.emojis.error} | That tag doesn't exist!`);

		data.guild.tags = data.guild.tags.filter((tag: any) => tag.name.toLowerCase() !== name.toLowerCase());
		data.guild.markModified("tags");
		await data.guild.save();

		embed.setDescription(`**Deleted ${tag.name}**\nI successfully deleted **${tag.name}**.`).setColor(Colors.Red);
	}

	await message.replyT({ embeds: [embed] });
}

export default new cmd(execute, {
	description: "Create, view, or delete a tag.",
	dirname: __dirname,
	aliases: [],
	usage: "(create) (name) (content)",
	slash: false,
	enabled: false,
	options: [{
		type: 1,
		name: "create",
		description: "Create a tag.",
		options: [{
			type: 3,
			name: "name",
			description: "The name of the tag.",
			required: true
		}, {
			type: 3,
			name: "content",
			description: "The content of the tag. PRO TIP: use <br> to create a new line.",
			required: true
		}]
	}, {
		type: 1,
		name: "view",
		description: "View a tag.",
		options: [{
			type: 3,
			name: "name",
			description: "The name of the tag to view.",
			required: true
		}]
	}, {
		type: 1,
		name: "list",
		description: "List the guild's tags."
	}, {
		type: 1,
		name: "delete",
		description: "Delete a tag.",
		options: [{
			type: 3,
			name: "name",
			description: "The name of the tag to delete.",
			required: true
		}]
	}]
});
