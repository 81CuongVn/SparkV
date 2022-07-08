"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const canvacord_1 = __importDefault(require("canvacord"));
const command_1 = __importDefault(require("../../../structures/command"));
function capFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
async function generate(bot, message, data) {
    const state = data.options.getSubcommand();
    if (state === "text") {
        const type = data.options.getString("type");
        const text = bot.functions.cleanContent(data.options.getString("text"), message.channel);
        if (type === "changemymind")
            return await canvacord_1.default.Canvas.changemymind(text);
        else if (type === "ohno")
            return await canvacord_1.default.Canvas.ohno(text);
        else if (type === "clyde")
            return await canvacord_1.default.Canvas.clyde(text);
    }
    else if (state === "user") {
        const type = data.options.getString("type");
        const user = data.options.getUser("user") || message.user;
        if (type === "jail")
            return await canvacord_1.default.Canvas.jail(user.displayAvatarURL({ extension: "png" }));
        else if (type === "garbage")
            return await canvacord_1.default.Canvas.shit(user.displayAvatarURL({ extension: "png" }));
        else if (type === "facepalm")
            return await canvacord_1.default.Canvas.facepalm(user.displayAvatarURL({ extension: "png" }));
        else if (type === "affect")
            return await canvacord_1.default.Canvas.affect(user.displayAvatarURL({ extension: "png" }));
        else if (type === "beautiful")
            return await canvacord_1.default.Canvas.beautiful(user.displayAvatarURL({ extension: "png" }));
        else if (type === "invert")
            return await canvacord_1.default.Canvas.invert(user.displayAvatarURL({ extension: "png" }));
        else if (type === "rainbow")
            return await canvacord_1.default.Canvas.rainbow(user.displayAvatarURL({ extension: "png" }));
        else if (type === "rip")
            return await canvacord_1.default.Canvas.rip(user.displayAvatarURL({ extension: "png" }));
        else if (type === "trash")
            return await canvacord_1.default.Canvas.trash(user.displayAvatarURL({ extension: "png" }));
        else if (type === "trigger")
            return await canvacord_1.default.Canvas.trigger(user.displayAvatarURL({ extension: "png" }));
        else if (type === "wasted")
            return await canvacord_1.default.Canvas.wasted(user.displayAvatarURL({ extension: "png" }));
        else if (type === "wanted")
            return await canvacord_1.default.Canvas.wanted(user.displayAvatarURL({ extension: "png" }));
    }
    else if (state === "slap") {
        const user = data.options.getUser("user") || message.user;
        const user2 = data.options.getUser("user2") || message.user;
        return await canvacord_1.default.Canvas.slap(user.displayAvatarURL({ extension: "png" }), user2.displayAvatarURL({ extension: "png" }));
    }
    else if (state === "bed") {
        const user = data.options.getUser("user") || message.user;
        const user2 = data.options.getUser("user2");
        return await canvacord_1.default.Canvas.bed(user2.displayAvatarURL({ extension: "png" }), user.displayAvatarURL({ extension: "png" }));
    }
    else if (state === "opinion") {
        const user = data.options.getUser("user") || message.user;
        const text = bot.functions.cleanContent(data.options.getString("text"), message.channel);
        return await canvacord_1.default.Canvas.opinion(user.displayAvatarURL({ extension: "png" }), text);
    }
    else if (state === "color") {
        const hex = data.options.getString("hex");
        return await canvacord_1.default.Canvas.color(hex);
    }
    else if (state === "youtube") {
        const user = data.options.getUser("user") || message.user;
        const text = data.options.getString("text");
        const dark = data.options.getBoolean("dark");
        return await canvacord_1.default.Canvas.youtube({
            username: user.username,
            avatar: user.displayAvatarURL({ extension: "png" }),
            content: text,
            dark
        });
    }
}
exports.default = new command_1.default(async (bot, message, args, command, data) => {
    const ImageLoading = await message.replyT({
        embeds: [{
                author: { name: `${message.user.tag}`, icon_url: message.user.displayAvatarURL() },
                title: await message.translate(`${bot.config.emojis.stats} | Creating image...`),
                description: await message.translate(`Please wait while I generate the image...`),
                color: discord_js_1.Colors.Blue,
                timestamp: new Date()
            }]
    });
    const imageName = await data.options.getString("type") || await data.options.getSubcommand();
    try {
        const Image = await generate(bot, message, data);
        await ImageLoading.edit({
            embeds: [{
                    author: { name: `${message.user.tag}`, icon_url: message.user.displayAvatarURL({ extension: "png" }) },
                    title: await message.translate(`${bot.config.emojis.stats} | ${capFirstLetter(imageName)}`),
                    image: { url: `attachment://${imageName}.${imageName === "trigger" ? "gif" : "png"}` },
                    color: discord_js_1.Colors.Green,
                    timestamp: new Date()
                }],
            files: [{ attachment: Image, name: `${imageName}.${imageName === "trigger" ? "gif" : "png"}` }]
        });
        /*
            components: [{
                type: 1,
                components: [{
                    type: 2,
                    label: "Download",
                    emoji: "<:download:994651105709535262>",
                    url: `attachment://${imageName}.${imageName === "trigger" ? "gif" : "png"}`,
                    style: 5
                }]
            }],
        */
    }
    catch (err) {
        bot.logger(err, "error");
        try {
            await ImageLoading?.edit({
                embeds: [{
                        title: await message.translate(`${bot.config.emojis.error} | ${capFirstLetter(imageName === "trigger" ? "gif" : "png")}`),
                        description: await message.translate("An error occured while creating the image. Please try again later!"),
                        color: discord_js_1.Colors.Red
                    }]
            });
        }
        catch (err) { }
    }
}, {
    description: "<:image:948004558884442142> Generate images with ease.",
    aliases: [],
    usage: `(image type)`,
    slash: true,
    cooldowns: 5,
    options: [{
            type: 1,
            name: "text",
            description: "Generate an image using text.",
            options: [{
                    type: 3,
                    name: "type",
                    description: "The type of text image to generate.",
                    required: true,
                    choices: [{
                            name: "ohno",
                            value: "ohno"
                        }, {
                            name: "changemymind",
                            value: "changemymind"
                        }, {
                            name: "clyde",
                            value: "clyde"
                        }]
                }, {
                    type: 3,
                    name: "text",
                    description: "The text for the image.",
                    required: true
                }
            ]
        }, {
            type: 1,
            name: "user",
            description: "Generate an image using a user.",
            options: [{
                    type: 3,
                    name: "type",
                    description: "The type of user image to generate.",
                    required: true,
                    choices: [{
                            name: "jail",
                            value: "jail"
                        }, {
                            name: "garbage",
                            value: "garbage"
                        }, {
                            name: "facepalm",
                            value: "facepalm"
                        }, {
                            name: "affect",
                            value: "affect"
                        }, {
                            name: "beautiful",
                            value: "beautiful"
                        }, {
                            name: "invert",
                            value: "invert"
                        }, {
                            name: "rainbow",
                            value: "rainbow"
                        }, {
                            name: "rip",
                            value: "rip"
                        }, {
                            name: "trash",
                            value: "trash"
                        }, {
                            name: "trigger",
                            value: "trigger"
                        }, {
                            name: "wanted",
                            value: "wanted"
                        }, {
                            name: "wasted",
                            value: "wasted"
                        }]
                },
                {
                    type: 6,
                    name: "user",
                    description: "The user to show in the image.",
                    required: true
                }]
        }, {
            type: 1,
            name: "opinion",
            description: "Oh my, that's a very bad opinion.",
            options: [{
                    type: 6,
                    name: "user",
                    description: "The user to show as a father's son saying a very bad opinion.",
                    required: true
                }, {
                    type: 3,
                    name: "text",
                    description: "The very bad opinion that the father is very mad at.",
                    required: true
                }]
        }, {
            type: 1,
            name: "bed",
            description: "Why do you hate me, brother?",
            options: [{
                    type: 6,
                    name: "user2",
                    description: "The user on the top of the bed, who calls his brother a monster.",
                    required: true
                }, {
                    type: 6,
                    name: "user",
                    description: "The user to show in the bed."
                }]
        }, {
            type: 1,
            name: "slap",
            description: "Damn, you really hurt him bad.",
            options: [{
                    type: 6,
                    name: "user2",
                    description: "The user who is getting slapped.",
                    required: true
                }, {
                    type: 6,
                    name: "user",
                    description: "The user who is slapping the other user. Leave blank to be you."
                }]
        }, {
            type: 1,
            name: "color",
            description: "Hex to color.",
            options: [{
                    type: 3,
                    name: "hex",
                    description: "The hex color code to show."
                }]
        }, {
            type: 1,
            name: "youtube",
            description: "Make a user say something from a YouTube comment.",
            options: [{
                    type: 3,
                    name: "text",
                    description: "The text of the comment.",
                    required: true
                }, {
                    type: 5,
                    name: "dark",
                    description: "Whether or not to use the dark theme of YouTube."
                }, {
                    type: 6,
                    name: "user",
                    description: "The user who typed the comment."
                }]
        }]
});
//# sourceMappingURL=image.js.map