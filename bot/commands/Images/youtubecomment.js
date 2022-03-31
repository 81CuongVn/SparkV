const Discord = require(`discord.js`);
const canvacord = require(`canvacord`);

const cmd = require("@templates/imageCommand");

module.exports = new cmd({
	description: `YouTube comment lol.`,
	aliases: ["ytcomment", "ytc"],
	dirname: __dirname,
	usage: `(user default: you) <text>`,
	slash: true,
	slashOnly: true,
	options: [
		{
			type: 3,
			name: "text",
			description: "The text of the comment.",
			required: true
		},
		{
			type: 5,
			name: "dark",
			description: "Whether or not to use the dark theme of YouTube."
		},
		{
			type: 6,
			name: "user",
			description: "The user who typed the comment."
		}
	],
	generate: async function(bot, message, data) {
		const user = data.options.getMember("user") || message.user;
		const text = data.options.getString("text");
		const dark = data.options.getBoolean("dark");

		return await canvacord.Canvas.youtube({
			username: (user.user ? user.user : user).username,
			avatar: user.displayAvatarURL({ format: "png" }),
			content: text,
			dark
		});
	}
});
