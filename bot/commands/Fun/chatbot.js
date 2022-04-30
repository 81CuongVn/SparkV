const Discord = require("discord.js");
const axios = require("axios");

const cmd = require("@templates/command");

async function execute(bot, message, args, command, data) {
	const text = data.options?.getString("text");
	const chatmsg = await axios.get(`http://api.brainshop.ai/get?bid=${encodeURIComponent(process.env.CHAT_BID)}&key=${encodeURIComponent(process.env.CHAT_KEY)}&uid=${encodeURIComponent(message.user.id)}&msg=${encodeURIComponent(text)}`).then(res => res?.data?.cnt || "Sorry, I have encountered an error! Please try again later.");

	const msg = await message.replyT(chatmsg);

	// const state = message.options.getSubcommand();

	// if (state === "start") {
	// 	if (data.guild.chatbot !== null) return message.replyT(`${bot.config.emojis.error} | There is already an active conversation with SparkV going on in <#${data.guild.chatbot}>.`);

	// 	const text = data.options?.getString("text");
	// 	const chatmsg = await axios.get(`http://api.brainshop.ai/get?bid=${encodeURIComponent(process.env.CHAT_BID)}&key=${encodeURIComponent(process.env.CHAT_KEY)}&uid=${encodeURIComponent(message.user.id)}&msg=${encodeURIComponent(text)}`).then(res => res?.data?.cnt || "Sorry, I have encountered an error! Please try again later.");

	// 	data.guild.chatbot = message.channel.id;
	// 	data.guild.markModified("chatbot");
	// 	await data.guild.save();

	// 	const msg = await message.replyT(chatmsg);
	// } else if (state === "stop") {
	// 	if (data.guild.chatbot === null) return message.replyT(`${bot.config.emojis.error} | There is't an active conversation with SparkV going on. You can start talking to SparkV by typing \`/chatbot start\`.`);

	// 	data.guild.chatbot = null;
	// 	data.guild.markModified("chatbot");
	// 	await data.guild.save();

	// 	const msg = await message.replyT(`${bot.config.emojis.error} | I have stopped the conversation with SparkV.`);
	// }
}

module.exports = new cmd(execute, {
	description: "Talk to me!",
	dirname: __dirname,
	usage: "",
	perms: ["EmbedLinks", "ManageMessages"],
	slash: true,
	slashOnly: true,
	options: [
		{
			type: 1,
			name: "start",
			description: "Start talking to SparkV in this channel.",
			options: [
				{
					type: 3,
					name: "text",
					description: "What to start of the conversation with.",
					required: true
				}
			]
		},
		{
			type: 1,
			name: "stop",
			description: "Stop talking to SparkV.",
			options: []
		}
	]
});
