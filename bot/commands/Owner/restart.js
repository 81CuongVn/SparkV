const Discord = require(`discord.js`);
let restarting = false;

const cmd = require("@templates/command");

async function execute(bot, message, args, command, data) {
	if (restarting === true) return;

	let Timer = 5;
	const RestartStatus = await message.replyT(`⚡ | SparkV is now preparing for restart. Time left: ${Timer} seconds.`);

	setInterval(() => {
		--Timer;

		if (Timer > 0) {
			if (restarting === true) return;

			RestartStatus.edit(`⚡ | SparkV is now preparing for restart. Time left: ${Timer} seconds.`);
		} else {
			if (restarting === true) return;

			RestartStatus.edit(`⚡ | SparkV is now restarting.`)
				.then(msg => {
					restarting = true;

					bot.destroy();
				})
				.then(async () => {
					bot.login(process.env.TOKEN);
					RestartStatus.edit("⚡ | Restart comeplete!");
				});
		}
	}, 1 * 1000);
}

module.exports = new cmd(execute, {
	description: `This is an owner only command.`,
	aliases: [],
	dirname: __dirname,
	usage: `<coins>`,
	ownerOnly: true
});
