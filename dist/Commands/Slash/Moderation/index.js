"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    name: "Moderation",
    description: "The power to ban, kick, mute and more at your control.",
    emoji: "<:shield:948028696097337344>",
    emojiID: "948028696097337344",
    commands: require("fs").readdirSync(__dirname).filter((c) => c !== "index.js" && c.endsWith(".js")).map((c) => require(`${__dirname}/${c}`))
};
//# sourceMappingURL=index.js.map