import { model, Document, Schema } from "mongoose";

export interface IUserModel extends Document {
	id: string,
	registrationDate: number,
	cooldowns: {
		daily: number,
		weekly: number
	},
	afk: {
		enabled: string,
		reason: string
	},
	money: {
		balance: number,
		bank: number,
		bankMax: number,
		multiplier: number
	},
	votes: {
		voted: number,
		total: number,
		remind: string,
		reminded: string
	},
	inventory: object
}

export default model<IUserModel>("User", new Schema({
	id: { type: String, unique: true },
	registrationDate: { type: Number, default: Date.now() },
	cooldowns: {
		daily: { type: Number, default: 0 },
		weekly: { type: Number, default: 0 }
	},
	afk: {
		enabled: { type: String, default: "false" },
		reason: { type: String, default: null }
	},
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
}));
