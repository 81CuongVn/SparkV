const Discord = require(`discord.js`);
const ms = require("ms");

const cmd = require("@templates/modCommand");

async function execute(bot, interaction, args, command, data) {
	const user = data.options.getMember("user");
	const time = ms(data.options.getString("time"));
	const reason = data.options.getString("reason");

	if (user.isCommunicationDisabled()) return interaction.replyT("That user is already in timeout!");
	if (user.id === interaction.member.id) return interaction.replyT(`${bot.config.emojis.error} | You cannot timeout yourself.`);
	if (user.user.bot) return await interaction.replyT(`You cannot timeout a bot lmfao.`);

	if (!time) return interaction.replyT("The time provided was invalid.");

	user.timeout(time, reason || "No reason provided.")
		.then(async () => await interaction.replyT(`${user} was successfully put on timeout for ${interaction.options.getString("time")}. Reason: ${reason}`))
		.catch(async () => await interaction.replyT(`Failed to put ${user} on timeout! Please check that I have the correct permissions and my role is higher than ${user}.`));
}

module.exports = new cmd(execute, {
	description: `Timeout a user.`,
	dirname: __dirname,
	aliases: [],
	usage: `(user) (optional: reason)`,
	perms: ["MODERATE_MEMBERS"],
	slash: true,
	slashOnly: true,
	options: [
		{
			type: 6,
			name: "user",
			description: "The user to timeout.",
			required: true
		},
		{
			type: 3,
			name: "time",
			description: "How long the user should be put on timeout for. (In seconds)",
			required: true
		},
		{
			type: 3,
			name: "reason",
			description: "The reason for putting this user on timeout.",
			required: false
		}
	]
});
