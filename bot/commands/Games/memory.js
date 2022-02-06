const Discord = require(`discord.js`);

const cmd = require("../../templates/gameCommand");

const MemoryTypes = [`🍎`, `🥭`, `🥑`, `🍏`, `🍐`, `🍋`, `🍓`, `🍒`, `🍍`, `🍌`, `🍊`, `🍉`, `🍇`, `🍅`];

const GenerateArray = level => {
	const Pick = MemoryTypes[Math.floor(Math.random() * 3)];
	const Array = [];

	for (let i = 0; i < level; i++) {
		Array.push(Pick[Math.floor(Math.random() * Pick.length)]);
	}

	return Array;
};

async function execute(bot, message, args, command, data) {
	if (!args) {
		return await message.replyT(
			`${bot.config.emojis.error} | Next time, say how many directions you want to challenge yourself with.`,
		);
	}

	if (args[0] < 1 || args[0] > 20) {
		return await message.replyT(`${bot.config.emojis.error} | You can only select between 1-20.`);
	}

	if (args[0] < 1 || args[0] > 20) {
		return await message.replyT(`${bot.config.emojis.error} | You can only select between 1-20.`);
	}

	try {
		const Memorize = GenerateArray(args[0]);
		const MemorizeMessage = await await message.replyT(Memorize.map(emoji => `${emoji}`).join(` `));

		await bot.wait(25 * 1000);
		MemorizeMessage.edit(`⚡ Now, type what you saw.`);

		const MemorizeType = Memorize.join(` `);
		const Guess = await message.channel.awaitMessages(res => messages.author.id === res.author.id, {
			max: 1,
			time: 30 * 1000,
		});

		if (!Guess.size) {
			return MemorizeMessage.edit(`❔ Times up! The emojis were ${MemorizeType}.`);
		}

		return MemorizeMessage.edit(`🎉 You won!`);
	} catch (err) {
		bot.logger(err, "error");
	}
}

module.exports = new cmd(execute, {
	description: `Pratice your memory!`,
	dirname: __dirname,
	usage: "<optional user>",
	aliases: ["memo"],
	perms: ["EMBED_LINKS"],
	type: "game",
});
