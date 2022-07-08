"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.default = (0, mongoose_1.model)("Guild", new mongoose_1.Schema({
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
//# sourceMappingURL=guild.js.map