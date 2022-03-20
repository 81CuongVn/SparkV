const Discord = require(`discord.js`);

const cmd = require("../../templates/modCommand");

async function execute(bot, message, args, command, data) {
	const User = data.options.getMember("user");
	const NewNickname = data.options.getString("nickname");

	if (NewNickname.length > 30) return await message.editT(`${bot.config.emojis.error} | That nickname is too long. Please keep it below 30 characters.`);
	if (User.roles.highest.comparePositionTo(message.guild.me.roles.highest) >= 0) return await message.editT(`Uh oh! I cannot change their nickname. They're a higher role than me!`);

	User.setNickname(NewNickname)
		.then(async () => await message.editT(`${bot.config.emojis.success} | Successfully changed ${User}\`s nickname to ${NewNickname}!`))
		.catch(async err => {
			bot.logger(err, "error");

			await message.editT(`${bot.config.emojis.error} | Uh oh! I cannot change their nickname. Please check my permissions and try again.`);
		});
}

module.exports = new cmd(execute, {
	description: "I'll change a user's nickname to your choice.",
	dirname: __dirname,
	aliases: ["setnick"],
	usage: `(user) (nickname)`,
	perms: ["CHANGE_NICKNAME"],
	slash: true,
	slashOnly: true,
	ephemeral: true,
	options: [
		{
			type: 6,
			name: "user",
			description: "The user who I should change the nickname of.",
		},
		{
			type: 3,
			name: "nickname",
			description: "The user's new nickname.",
		}
	]
});
