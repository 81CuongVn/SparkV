"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    name: "Economy",
    description: "Get rich! Use our fun profit commands.",
    emoji: "<:coin:948362336736006144>",
    emojiID: "948362336736006144",
    commands: require("fs").readdirSync(__dirname).filter((c) => c !== "index.js" && c.endsWith(".js")).map((c) => require(`${__dirname}/${c}`))
};
//# sourceMappingURL=index.js.map