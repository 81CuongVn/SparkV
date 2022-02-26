const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
	id: { type: String, unique: true },
	registrationDate: { type: Number, default: Date.now() },
	cooldowns: { type: Object, default: {
		daily: 0,
		weekly: 0
	} },
	afk: { type: String, default: null },
	money: { type: Object, default: {
		balance: 100,
		bank: 0,
		bankMax: 2000,
		multiplier: 1
	} },
	votes: { type: Object, default: {
		voted: 0,
		total: 0,
		remind: "false"
	} },
	inventory: { type: Object, default: {} },
});

module.exports = mongoose.model("User", Schema);
