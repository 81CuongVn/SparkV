"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const handler_1 = __importDefault(require("../../Database/handler"));
exports.default = {
    once: false,
    async execute(bot, oldMember, newMember) {
        const data = await handler_1.default.getGuild(newMember.guild.id);
        if (data.welcome.enabled === "false")
            return;
        if (oldMember.pending === true && newMember.pending === false) {
            if ((data.welcome?.roles?.length || 0) > 0) {
                data.welcome?.roles?.forEach((r) => newMember.roles.add(r.id).catch(() => { }));
            }
        }
    }
};
//# sourceMappingURL=guildMemberUpdate.js.map