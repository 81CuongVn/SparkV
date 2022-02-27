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

	plugins: { type: Object, default: {
		welcome: {
			enabled: "false",
			message: "Welcome {mention} to **{server}**! You're our **{members}th member**!",
			roles: [],
			channel: null
		},
		goodbye: {
			enabled: "false",
			message: "Bye {mention}! We're really sad to see you go. Without you, we're now **{members} members**.",
			channel: null
		},
		automod: {
			removeLinks: "false",
			removeProfanity: "false",
			removeDuplicateText: "false"
		},
		leveling: {
			enabled: "false",
			message: "<a:tada:819934065414242344> Congrats {author}, you're now at level **{level}**!",
			channel: null,
			max: 25,
			min: 5
		},
		starboard: {
			enabled: "false",
			channel: null,
			emoji: "⭐",
			min: 1,
		},
		chatbot: "false",
	} }
});

module.exports = new mongoose.model("Guild", Schema);
