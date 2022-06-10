const Discord = require("discord.js");
const axios = require("axios");

const cmd = require("@structures/command");

async function execute(bot, message, args, command, data) {
	const text = data.options?.getString("text");
	const chatmsg = await axios.get(`http://api.brainshop.ai/get?bid=${encodeURIComponent(process.env.CHAT_BID)}&key=${encodeURIComponent(process.env.CHAT_KEY)}&uid=${encodeURIComponent(message.user.id)}&msg=${encodeURIComponent(text)}`).then(res => res?.data?.cnt || "Sorry, I have encountered an error! Please try again later.");

	const msg = await message.replyT(chatmsg);
}

module.exports = new cmd(execute, {
	description: "Talk to me!",
	dirname: __dirname,
	usage: "",
	perms: [],
	slash: true,
	slashOnly: true,
	options: [
		{
			type: 3,
			name: "text",
			description: "What to start of the conversation with.",
			required: true
		}
	]
});
