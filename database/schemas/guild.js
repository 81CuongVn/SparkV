const mongoose = require("mongoose");

const config = require("../../globalconfig.json");

const Schema = new mongoose.Schema({
	id: { type: String, required: true, unique: true },
	registrationDate: { type: Number, default: Date.now() },

	// Data //
	language: { type: String, default: "en" },
	casesCount: { type: Number, default: 0 },
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
			min: 1
		},
		logging: {
			enabled: "false",
			channel: null,
			level: "info"
		},
		chatbot: "false"
	} },
	tickets: {
		category: { type: String, default: null },
		roles: { type: Array, default: [] },
	},
	tags: { type: Array, default: [] }
});

module.exports = new mongoose.model("Guild", Schema);
