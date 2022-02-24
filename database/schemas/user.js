const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
	id: { type: String, unique: true },
	bio: { type: String },
	birthday: { type: Number },
	registrationDate: { type: Number, default: Date.now() },
	cooldowns: { type: Object, default: {
		daily: 0,
		weekly: 0
	} },
	afk: { type: String, default: null },
	money: {
		balance: { type: Number, default: 100 },
		bank: { type: Number, default: 0 },
		bankMax: { type: Number, default: 2000 },
		multiplier: { type: Number, default: 1 }
	},
	votes: { type: Object, default: {
		voted: null,
		total: 0,
		remind: false
	} },
	inventory: {}
});

module.exports = mongoose.model("User", Schema);
