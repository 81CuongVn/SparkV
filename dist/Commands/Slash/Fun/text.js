"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const figlet_1 = __importDefault(require("figlet"));
const command_1 = __importDefault(require("../../../Structures/command"));
const chars = {
    0: ":zero:",
    1: ":one:",
    2: ":two:",
    3: ":three:",
    4: ":four:",
    5: ":five:",
    6: ":six:",
    7: ":seven:",
    8: ":eight:",
    9: ":nine:",
    10: ":ten:",
    "?": ":grey_question:",
    "!": ":grey_exclamation:",
    "#": ":hash:",
    "*": ":asterisk:",
    " ": "   "
};
const zalgo = {
    up: [
        "̍", "̎", "̄", "̅", "̿", "̑", "̆", "̐", "͒", "͗", "͑", "̇", "̈", "̊",
        "͂", "̓", "̈́", "͊", "͋", "͌", "̃", "̂", "̌", "͐", "̀", "́", "̋", "̏",
        "̒", "̓", "̔", "̽", "̉", "ͣ", "ͤ", "ͥ", "ͦ", "ͧ", "ͨ", "ͩ", "ͪ", "ͫ",
        "ͬ", "ͭ", "ͮ", "ͯ", "̾", "͛", "͆", "̚"
    ],
    middle: [
        "̕", "̛", "̀", "́", "͘", "̡", "̢", "̧", "̨", "̴", "̵", "̶", "͏", "͜",
        "͝", "͞", "͟", "͠", "͢", "̸", "̷", "͡", "҉"
    ],
    down: [
        "̖", "̗", "̘", "̙", "̜", "̝", "̞", "̟", "̠", "̤", "̥", "̦", "̩", "̪",
        "̫", "̬", "̭", "̮", "̯", "̰", "̱", "̲", "̳", "̹", "̺", "̻", "̼", "ͅ",
        "͇", "͈", "͉", "͍", "͎", "͓", "͔", "͕", "͖", "͙", "͚", "̣"
    ]
};
async function execute(bot, message, args, command, data) {
    const type = data.options.getString("type");
    const text = data.options.getString("text");
    if (!text)
        return await message.replyT(`${bot.config.emojis.error} | Please supply text.`);
    if (text.length > 500)
        return await message.replyT(`${bot.config.emojis.error} | Please keep the text under 500 characters.`);
    let editedText;
    switch (type) {
        case "reverse":
            editedText = text.split("").reverse().join("");
        case "emojify":
            editedText = text.toLowerCase().split("").map(letter => {
                if (/[a-z]/g.test(letter))
                    return `:regional_indicator_${letter}: `;
                else if (chars[letter])
                    return `${chars[letter]} `;
                return letter;
            }).join("");
        case "asciify":
            figlet_1.default.text(text, async (err, data) => {
                if (err) {
                    console.log(`Failed to figlet text: ${err}`);
                    return await message.editT(`Uh oh! Something went wrong.`);
                }
                editedText = `\`\`\`${data}\`\`\``;
            });
        case "clapify":
            editedText = text.trim().split(/ +/g).length === 1 ? text.split("").join(" 👏 ") : text.trim().split(/ +/g).join(" 👏 ");
        case "zalgo":
            // Special thanks to the package to-zalgo, to who are responcible for creating this part of the text command.
            // https://github.com/michaelrhodes/to-zalgo/blob/master/index.ts
            // It had some useless packages that I didn't want taking up my node_modules folder.
            let counts = {
                up: 0,
                middle: 0,
                down: 0
            };
            let result = "";
            const types = [];
            types.push("up");
            types.push("middle");
            types.push("down");
            for (let i = 0, l = text.length; i < l; i++) {
                if (RegExp(`(${[].concat(zalgo?.up, zalgo.middle, zalgo.down).join("|")})`, "g").test(text[i]))
                    continue;
                if (text[i].length > 1) {
                    result += text[i];
                    continue;
                }
                counts.up = ~~(Math.random() * 8) + 1;
                counts.middle = ~~(Math.random() * 3);
                counts.down = ~~(Math.random() * 8) + 1;
                result += text[i];
                for (let j = 0, m = types.length; j < m; j++) {
                    const type = types[j];
                    let count = counts[type];
                    const tchars = zalgo[type];
                    while (count--)
                        result += tchars[~~(Math.random() * (tchars.length - 1))];
                }
            }
            editedText = result;
        case "char_count":
            editedText = `That text has **${text.length} characters**.`;
    }
    await message.replyT((editedText?.length ?? 0) >= 2000 ? `${editedText?.slice(0, 1990)}...` : editedText);
}
exports.default = new command_1.default(execute, {
    description: "I will change the text depending on what you want to do.",
    aliases: [],
    dirname: __dirname,
    usage: "(text)",
    slash: true,
    options: [{
            type: 3,
            name: "text",
            description: "The text to change.",
            required: true
        }, {
            type: 3,
            name: "type",
            description: "What you want to do to the text. (reverse, emojify, asciify)",
            required: true,
            choices: [{
                    name: "reverse",
                    value: "reverse"
                }, {
                    name: "emojify",
                    value: "emojify"
                }, {
                    name: "asciify",
                    value: "asciify"
                }, {
                    name: "clapify",
                    value: "clapify"
                }, {
                    name: "zalgo",
                    value: "zalgo"
                }, {
                    name: "char_count",
                    value: "char_count"
                }]
        }]
});
//# sourceMappingURL=text.js.map