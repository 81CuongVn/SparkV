const Discord = require("discord.js");

const cmd = require("../../templates/command");

async function execute(bot, message, args, command, data) {
	const ID = args[0];

	if (!ID || isNaN(ID)) {
		return await message.replyT(`Please provide a valid message ID.`);
	}

	const Giveaway = bot.GiveawayManager.giveaways.find(giveaway => giveaway.messageID === args[0]);

	if (!Giveaway) {
		return await message.replyT(`I couldn\'t find a giveaway with that message ID.`);
	}

	bot.GiveawayManager.reroll(Giveaway.messageID).then(async () => await message.replyT("Giveaway successfully rerolled!")).catch(async err => {
		if (err.startsWith(`Giveaway with ID ${Giveaway.messageID} is not ended`)) {
			await message.replyT("This giveaway hasn't ended yet!");
		} else {
			console.error(err).then(async () => {
				await message.replyT("An error occured with SparkV! Please try this command again.");
			});
		}
	});
}

module.exports = new cmd(execute, {
	description: "Rerolls a giveaway. Requires the permision MANAGE_MESSAGES.",
	dirname: __dirname,
	usage: "<MessageID>",
	aliases: ["rerollg"],
	perms: ["EMBED_LINKS", "MANAGE_MESSAGES"],
	gname: "youtube",
	type: "together",
});
