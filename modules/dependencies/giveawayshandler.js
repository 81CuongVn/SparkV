const { GiveawaysManager } = require("discord-giveaways");

const GiveawaysSchema = require("../../database/schemas/giveaways");
const logger = require("@modules/logger");

module.exports = async bot => {
	class GiveawayManagerWithOwnDatabase extends GiveawaysManager {
		async getAllGiveaways() {
			return await GiveawaysSchema.find().lean().exec();
		}

		async saveGiveaway(messageId, giveawayData) {
			await GiveawaysSchema.create(giveawayData);

			return true;
		}

		async editGiveaway(messageId, giveawayData) {
			await GiveawaysSchema.updateOne({
				messageId
			}, giveawayData, {
				omitUndefined: true
			}).exec();

			return true;
		}

		async deleteGiveaway(messageId) {
			await GiveawaysSchema.deleteOne({ messageId }).exec();

			return true;
		}
	}

	bot.GiveawayManager = new GiveawayManagerWithOwnDatabase(bot, {
		updateCountdownEvery: 2.5 * 1000,
		default: {
			botsCanWin: false,
			exemptPermissions: [],
			embedColor: bot.config.embed.color,
			embedColorEnd: "#FF0000",
			reaction: "🎉",
		},
	});
};
