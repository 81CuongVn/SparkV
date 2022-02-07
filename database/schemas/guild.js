const mongoose = require("mongoose");

const config = require("../../globalconfig.json");

const Schema = new mongoose.Schema({
	id: { type: String, required: true, unique: true },
	registrationDate: { type: Number, default: Date.now() },

	// Data //
	prefix: { type: String, required: true, trim: true, default: config.prefix || "^" },
	language: { type: String, default: "en" },
	casesCount: { type: Number, default: 0 },
	autoRemoveCommands: { type: Boolean, default: "false" },

	plugins: {
		welcome: {
			type: Object,
			default: {
				enabled: "false",
				message: "Welcome {mention} to **{server}**! You're our **{members}th member**!",
				channel: null
			}
		},
		goodbye: {
			type: Object,
			default: {
				enabled: "false",
				message: "Bye {mention}! We're really sad to see you go. Without you, we're now **{members} members**.",
				channel: null
			}
		},
		automod: {
			type: Object,
			default: {
				removeLinks: "false",
				removeProfanity: "false",
				removeDuplicateText: "false"
			}
		},
		leveling: {
			type: Object,
			default: {
				enabled: "false",
				message: "<a:tada:819934065414242344> Congrats {author}, you're now at level **{level}**!",
				channel: null,
				max: 25,
				min: 5
			}
		},
		starboard: {
			type: Object,
			default: {
				enabled: "false",
				channel: null,
				emoji: "⭐",
				min: 1,
			}
		},
		chatbot: { type: String, default: "false" },
	}
});

module.exports = new mongoose.model("Guild", Schema);
