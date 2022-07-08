"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGuild = exports.getMember = exports.getUser = void 0;
const user_1 = __importDefault(require("./schemas/user"));
const member_1 = __importDefault(require("./schemas/member"));
const guild_1 = __importDefault(require("./schemas/guild"));
async function getUser(id) {
    const data = await user_1.default.findOne({ id });
    if (data)
        return data;
    return new user_1.default({ id });
}
exports.getUser = getUser;
async function getMember(id, guildID) {
    const member = await member_1.default.findOne({ id, guildID });
    if (member)
        return member;
    return new member_1.default({ id, guildID });
}
exports.getMember = getMember;
async function getGuild(id) {
    const guild = await guild_1.default.findOne({ id });
    if (guild)
        return guild;
    return new guild_1.default({ id });
}
exports.getGuild = getGuild;
exports.default = { getUser, getMember, getGuild };
//# sourceMappingURL=handler.js.map