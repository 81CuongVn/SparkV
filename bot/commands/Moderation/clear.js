const Discord = require(`discord.js`);

const cmd = require("../../templates/modCommand");

async function execute(bot, message, args, command, data) {
	let number = data.options.getNumber("number");

	const type = data.options.getString("type") || null;
	const user = data.options.getMember("user") || null;

	if (type === "all") {
		const clonedChannel = await message.channel.clone();

		await clonedChannel.setPosition(message.channel.position);
		await message.channel.delete();

		return clonedChannel.send("Successfully cleared **all** messages.").then(m => setTimeout(() => m.delete(), 5 * 1000));
	}

	if (number < 1) {
		return message.replyT({
			content: "Please provide valid command usage. For example, {prefix}clear <number of messages to delete>. If you want to delete all the messages, then just do ^clear all.",
			ephemeral: true,
		});
	}

	if (message?.applicationId) {
		await message.deleteReply();
	} else {
		await message.delete().catch(err => {});
	}

	let messages = await message.channel.messages.fetch({
		limit: 100,
	});
	messages = messages.toJSON();

	if (user) messages = messages.filter(m => m.author.id === user.user.id);
	if (type === "pinned") messages = messages.filter(m => !m.pinned);

	if (messages.length > number) messages.length = parseInt(number, 10);

	number++;

	message.channel.bulkDelete(messages, true);

	const mSuccess = await message.replyT({
		content: `Successfully cleared **${--number}** messages${user ? ` from ${user.user.tag}.` : "."}`,
		ephemeral: true,
	});
}

module.exports = new cmd(execute, {
	description: `I'll delete messages for you!`,
	dirname: __dirname,
	usage: `<# of messages | all> <Optional: (Type (user only, pinned only))>`,
	aliases: [`purge`, `clr`],
	perms: ["MANAGE_MESSAGES"],
	slash: true,
	slashOnly: true,
	options: [
		{
			type: 10,
			name: "number",
			description: "The number of messages to delete.",
			required: true
		},
		{
			type: 3,
			name: "type",
			description: "The type of messages to delete. (All, Pinned, or Embeds)",
			choices: [
				{
					name: "all",
					value: "all"
				},
				{
					name: "pinned",
					value: "pinned"
				}
			]
		},
		{
			type: 6,
			name: "user",
			description: "The user to delete the messages of.",
		}
	]
});
