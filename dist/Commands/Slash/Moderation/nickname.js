"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const modCommand_1 = __importDefault(require("../../../structures/modCommand"));
async function execute(bot, message, args, command, data) {
    const User = data.options.getMember("user");
    const NewNickname = data.options.getString("nickname");
    if (NewNickname.length > 30)
        return await message.editT(`${bot.config.emojis.error} | That nickname is too long. Please keep it below 30 characters.`);
    if (User.roles.highest.comparePositionTo(message.guild.members.cache.get(bot.user.id).roles.highest) >= 0)
        return await message.editT(`Uh oh! I cannot change their nickname. They're a higher role than me!`);
    User.setNickname(NewNickname)
        .then(async () => await message.editT(`${bot.config.emojis.success} | Successfully changed ${User}\`s nickname to ${NewNickname}!`))
        .catch(async (err) => await message.editT(`${bot.config.emojis.error} | Uh oh! I cannot change their nickname. Please check my permissions and try again.`));
}
exports.default = new modCommand_1.default(execute, {
    description: "I'll change a user's nickname to your choice.",
    dirname: __dirname,
    aliases: ["setnick"],
    usage: `(user) (nickname)`,
    perms: ["ChangeNickname"],
    bot_perms: ["ChangeNickname"],
    slash: true,
    ephemeral: true,
    options: [{
            type: 6,
            name: "user",
            description: "The user who I should change the nickname of.",
            required: true
        }, {
            type: 3,
            name: "nickname",
            description: "The user's new nickname.",
            required: true
        }]
});
//# sourceMappingURL=nickname.js.map