"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = __importDefault(require("discord.js"));
const handler_1 = __importDefault(require("../../Database/handler"));
exports.default = {
    once: false,
    async execute(bot, member) {
        const data = await handler_1.default.getGuild(member.guild.id);
        if (data.welcome.enabled === "false")
            return;
        if (member.pending === false) {
            if ((data?.welcome?.roles?.length || 0) > 0) {
                data.welcome?.roles?.forEach((r) => member.roles.add(r.id).catch(err => { }));
            }
        }
        const channel = member?.guild?.channels?.cache.get(data.goodbye?.channel);
        if (!channel)
            return;
        const image = await bot.functions.createCard({
            user: member.user,
            text: {
                title: "Welcome!",
                desc: "Welcome to the server!",
                footer: `You're our ${member.guild.memberCount}${member.guild.memberCount === 1 ? "st" : (member.guild.memberCount === 2 ? "nd" : (member.guild.memberCount >= 3 ? "th" : "th"))} member!`
            }
        });
        const attachment = new discord_js_1.default.AttachmentBuilder(image.toBuffer());
        const msg = data.welcome.message
            .replaceAll("{mention}", `${member}`)
            .replaceAll("{tag}", `${member.user.tag}`)
            .replaceAll("{username}", `${member.user.username}`)
            .replaceAll("{server}", `${member.guild.name}`)
            .replaceAll("{members}", `${bot.functions.formatNumber(member.guild.memberCount)}`);
        channel.send({
            content: msg,
            files: [attachment.setName(`Welcome-${member.user.tag}.png`)]
        }).catch(() => { });
    }
};
//# sourceMappingURL=guildMemberAdd.js.map