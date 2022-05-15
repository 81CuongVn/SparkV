const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
	id: { type: String, unique: true },
	registrationDate: { type: Number, default: Date.now() },
	cooldowns: {
		daily: { type: Number, default: 0 },
		weekly: { type: Number, default: 0 }
	},
	afk: { type: String, default: null },
	money: {
		balance: { type: Number, default: 100 },
		bank: { type: Number, default: 0 },
		bankMax: { type: Number, default: 2000 },
		multiplier: { type: Number, default: 1 }
	},
	votes: {
		voted: { type: Number, default: 0 },
		total: { type: Number, default: 0 },
		remind: { type: String, default: "false" },
		reminded: { type: String, default: "false" }
	},
	inventory: { type: Object, default: {} }
});

module.exports = mongoose.model("User", Schema);
