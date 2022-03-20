const Discord = require("discord.js");

const cmd = require("../../templates/command");

function CreateEmojis(level) {
	const MemoryTypes = [
		"🍎",
		"🥭",
		"🥑",
		"🍏",
		"🍐",
		"🍋",
		"🍓",
		"🍒",
		"🍍",
		"🍌",
		"🍊",
		"🍉",
		"🍇",
		"🍅"
	];

	let text = "";

	for (let i = 0; i < level; i++) {
		text += MemoryTypes[Math.floor(Math.random() * MemoryTypes.length)];
	}

	return text;
}

async function execute(bot, message, args, command, data) {
	const level = data.options.getNumber("level") || 5;

	if (level < 1 || level > 20) return await message.replyT(`${bot.config.emojis.error} | You can only select between 1-20.`);

	const Memorize = CreateEmojis(level);
	const MemorizeEmbed = new Discord.MessageEmbed()
		.setAuthor({
			name: (message.user ? message.user : message.author).tag,
			iconURL: (message.user ? message.user : message.author).displayAvatarURL({ dynamic: true })
		})
		.setDescription(Memorize)
		.setFooter({
			text: `You have 15 seconds to remember this pattern! • ${bot.config.embed.footer}`,
			iconURL: bot.user.displayAvatarURL()
		})
		.setColor(bot.config.embed.color);

	const MemorizeMessage = await message.replyT({
		embeds: [MemorizeEmbed],
	});

	await bot.wait(15 * 1000);

	MemorizeMessage.edit({
		embeds: [MemorizeEmbed.setDescription("Send the pattern!").setFooter(`You have 15 seconds to send the pattern you just saw. • ${bot.config.embed.footer}`)]
	});

	const Guess = await message.channel.awaitMessages(res => messages.author.id === res.author.id, {
		max: 1,
		time: 15 * 1000,
		errors: ["time"],
		filter: m => {
			if (!m?.content) return message.replyT("You didn't send a message!");
		}
	}).then(collected => {
		collected = collected.first();

		if (collected.content.toLowerCase() === Memorize.toLowerCase()) {
			return MemorizeMessage.edit(`🎉 You won! The pattern was: ${Memorize}`);
		} else {
			return MemorizeMessage.edit(`💔 You lost. The pattern was: ${Memorize}`);
		}
	}).catch(err => MemorizeMessage.edit(`❔ Times up! The emojis were ${Memorize}.`));
}

module.exports = new cmd(execute, {
	description: "Pratice your memory!",
	dirname: __dirname,
	usage: "(level default: 5)",
	aliases: ["memo"],
	perms: [],
	cooldown: 5,
	slash: true,
	slashOnly: true,
	options: [
		{
			type: 10,
			name: "level",
			description: "The amount of emojis to show for you to remember."
		}
	]
});
