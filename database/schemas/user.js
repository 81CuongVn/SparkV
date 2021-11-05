const mongoose = require("mongoose");

function GenerateToken() {
	const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwzy0123456789.-_";
	let token = "CS-";

	for (let i = 0; i < 32; i++) {
		token += characters.charAt(Math.floor(Math.random() * characters.length));
	}

	return token;
}

const Schema = new mongoose.Schema({
	// User //
	id: { type: String },

	// Information //
	bio: { type: String },
	birthday: { type: Number },

	// Stats //
	registrationDate: { type: Number, default: Date.now() },

	// Data //
	APIToken: { type: String, default: GenerateToken() },
	cooldowns: { type: Object, default: {
		daily: { type: Number, trim: true, required: true, default: 0 },
		weekly: { type: Number, trim: true, required: true, default: 0 }
	} },
	afk: { type: String, default: null },
	money: {
		balance: { type: Number, default: 0 },
		bank: { type: Number, default: 0 },
		bankMax: { type: Number, default: 0 },
		multiplier: { type: Number, default: 0 }
	},
	inventory: {},
	totalVotes: { type: Number, default: 0 },
	voteStreak: { type: Number, default: 0 }
});

Schema.method("GenerateAPIToken", async () => {
	this.APIToken = GenerateToken();

	data.guild.markModified("APIToken");
	await this.save();
	return this.APIToken;
});

Schema.pre("findOneAndUpdate", function() {
	const update = this.getUpdate();
	if (update.__v !== null) {
		delete update.__v;
	}
	const keys = ["$set", "$setOnInsert"];
	for (const key of keys) {
		if (update[key] !== null && update[key].__v !== null) {
			delete update[key].__v;
			if (Object.keys(update[key]).length === 0) {
				delete update[key];
			}
		}
	}
	update.$inc = update.$inc || {};
	update.$inc.__v = 1;
});

module.exports = mongoose.model("User", Schema);
