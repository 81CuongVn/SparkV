import { model, Document, Schema } from "mongoose";

export interface IGuildModel extends Document {
	id: string,
	registrationDate: Number

	// Data //
	language: string,
	casesCount: Number,
	welcome: {
		enabled: string,
		message: string,
		roles: Array<[]>,
		channel: string,
	},
	goodbye: {
		enabled: string,
		message: string,
		channel: string
	},
	antiScam: {
		enabled: string,
		action: string,
		custom: Array<[]>,
		bypass: Array<[]>
	},
	antiSpam: {
		enabled: string,
		action: string,
		// Bypass: {
		// 	roles: Array, default: [] },
		// 	channels: Array, default: [] }
		// }
	},
	automod: {
		removeLinks: string,
		removeProfanity: string,
		removeDuplicateText: string
	},
	leveling: {
		enabled: string,
		message: string,
		channel: string
	},
	starboard: {
		enabled: string,
		channel: string,
		emoji: string,
		min: Number
	},
	logging: {
		enabled: string,
		channel: string,
		level: string
	},
	chatbot: string,
	tickets: {
		category: string,
		roles: Array<[]>
	},
	tags: Array<[]>
}

export default model<IGuildModel>("Guild", new Schema({
	id: { type: String, required: true, unique: true },
	registrationDate: { type: Number, default: Date.now() },

	// Data //
	language: { type: String, default: "en" },
	casesCount: { type: Number, default: 0 },
	welcome: {
		enabled: { type: String, default: "false" },
		message: { type: String, default: "{mention} just joined the server. Welcome!" },
		roles: { type: Array, default: [] },
		channel: { type: String, default: "null" }
	},
	goodbye: {
		enabled: { type: String, default: "false" },
		message: { type: String, default: "Bye {mention}! We're really sad to see you go. Without you, we're now **{members} members**." },
		channel: { type: String, default: "null" }
	},
	antiScam: {
		enabled: { type: String, default: "false" },
		action: { type: String, default: "timeout" },
		custom: { type: Array, default: [] },
		bypass: { type: Array, default: [] }
	},
	antiSpam: {
		enabled: { type: String, default: "false" },
		action: { type: String, default: "timeout" }
		// Bypass: {
		// 	roles: { type: Array, default: [] },
		// 	channels: { type: Array, default: [] }
		// }
	},
	automod: {
		removeLinks: { type: String, default: "false" },
		removeProfanity: { type: String, default: "false" },
		removeDuplicateText: { type: String, default: "false" }
	},
	leveling: {
		enabled: { type: String, default: "false" },
		message: { type: String, default: "<a:tada:819934065414242344> Congrats {author}, you're now at level **{level}**!" },
		channel: { type: String, default: "null" }
	},
	starboard: {
		enabled: { type: String, default: "false" },
		channel: { type: String, default: "null" },
		emoji: { type: String, default: "⭐" },
		min: { type: Number, default: 1 }
	},
	logging: {
		enabled: { type: String, default: "false" },
		channel: { type: String, default: "null" },
		level: { type: String, default: "info" }
	},
	chatbot: { type: String, default: "null" },
	tickets: {
		category: { type: String, default: "null" },
		roles: { type: Array, default: [] }
	},
	tags: [{ type: Array, default: [] }]
}));
