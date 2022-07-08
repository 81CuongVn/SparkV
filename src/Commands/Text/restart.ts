import Discord, { Message } from "discord.js";
let restarting = false;

import cmd from "../../structures/command";

async function execute(bot: any, message: any, args: string[], command: any, data: any) {
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
				.then((msg: Message) => {
					restarting = true;

					bot.destroy();
				})
				.then(async () => {
					bot.login(process.env.TOKEN);
					RestartStatus.edit("⚡ | Restart complete!");
				});
		}
	}, 1 * 1000);
}

export default new cmd(execute, {
	description: `This is an owner only command.`,
	aliases: [],
	dirname: __dirname,
	usage: `<coins>`,
	ownerOnly: true
});
