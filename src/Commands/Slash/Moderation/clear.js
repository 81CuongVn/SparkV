const Discord = require(`discord.js`);

const cmd = require("@structures/modCommand");

async function execute(bot, message, args, command, data) {
	let number = data.options.getNumber("number");

	const type = data.options.getString("type") || null;
	const user = data.options.getMember("user") || null;

	if (type === "all") {
		const clonedChannel = await message.channel.clone();

		await clonedChannel.setPosition(message.channel.position);
		await message.channel.delete();

		return clonedChannel.send(`${bot.config.emojis.success} | Successfully cleared **all** messages.`).then(m => setTimeout(() => m.delete(), 5 * 1000));
	}

	if (number < 1 || number > 100) return message.replyT(`${bot.config.emojis.success} | Next time, please provide a number greater than 0 and less than 100.`);

	await message.deleteReply().catch(err => {});

	let messages = await message.channel.messages.fetch({
		limit: 100
	}).catch(err => {});
	messages = messages.toJSON();

	if (user) messages = messages.filter(m => m.author.id === user.user.id);
	if (type === "pinned") messages = messages.filter(m => !m.pinned);
	if (data.options.getString("content")) messages = messages.filter(m => m.content.toLowerCase().includes(data.options.getString("content").toLowerCase()));

	if (messages.length > number) messages.length = parseInt(number, 10);
	number++;

	try {
		message.channel.bulkDelete(messages, true);

		await message.replyT(`${bot.config.emojis.success} | Successfully cleared **${--number}** messages${user ? ` from ${user.user.tag}.` : "."}`).then(m => setTimeout(() => m.delete().catch(err => err), 5 * 1000));
	} catch (err) {
		await message.replyT(`${bot.config.emojis.error} | Uh oh! I failed to clear **${--number}** messages${user ? ` from ${user.user.tag}` : ""}. Please check my permissions and try again.`);
	}
}

module.exports = new cmd(execute, {
	description: `I'll delete messages for you!`,
	dirname: __dirname,
	usage: `(# of messages) (Optional: Type (all, user only, pinned only))`,
	aliases: [`purge`, `clr`],
	perms: ["MANAGE_MESSAGES"],
	bot_perms: ["MANAGE_MESSAGES"],
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
			description: "The user to delete the messages of."
		},
		{
			type: 3,
			name: "content",
			description: "Only delete messages that contain this content."
		}
	]
});
