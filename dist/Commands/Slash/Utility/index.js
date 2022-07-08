"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    name: "Utility",
    description: "Commands mostly used for basic actions, such as getting a server's icon.",
    emoji: "<:tool:948028430979567646>",
    emojiID: "948028430979567646",
    commands: require("fs").readdirSync(__dirname).filter((c) => c !== "index.js" && c.endsWith(".js")).map((c) => require(`${__dirname}/${c}`))
};
//# sourceMappingURL=index.js.map