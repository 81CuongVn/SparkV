"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
exports.default = mongoose_1.default.model("Member", new mongoose_1.default.Schema({
    // User Information //
    id: { type: String },
    guildID: { type: String },
    // Information //
    bio: { type: String },
    birthday: { type: Number },
    // Stats //
    registrationDate: { type: Number, default: Date.now() },
    // Data //
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 0 },
    infractions: { type: Array, default: [] },
    infractionsCount: { type: Number, default: 0 },
    mute: {
        type: Object,
        default: { muted: false, case: null, endDate: null },
    }
}));
//# sourceMappingURL=member.js.map