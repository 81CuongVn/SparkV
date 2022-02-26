const Discord = require("discord.js");

const cmd = require("../../templates/command");

module.exports = new cmd(
	async (bot, message, args, command, data) => {
		const state = data.options.getString("state");

		if (state === "on") {
			data.user.votes.remind = "true";
		} else if (state === "off") {
			data.user.votes.remind = "false";
		} else {
			return await message.editT({
				content: "Please provide a valid state! (on/off)",
				ephemeral: true,
			});
		}

		data.user.markModified("votes.remind");
		await data.user.save();

		await message.editT({
			content: `Okay, I ${state === "on" ? "will" : "won't"} remind you to vote.${state === "on" ? " Thank you for supporting SparkV!" : ""}`,
			ephemeral: true,
		});
	},
	{
		description: "Want to be reminded to vote for SparkV? We'll give you ⏣25,000 coins per vote.",
		dirname: __dirname,
		usage: "(on/off)",
		aliases: [],
		perms: [],
		slash: true,
		slashOnly: true,
		ephemeral: true,
		options: [
			{
				type: 3,
				name: "state",
				description: "Whether you should be reminded to vote or not.",
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
		]
	},
);
