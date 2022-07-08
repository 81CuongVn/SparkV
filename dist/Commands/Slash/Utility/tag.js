"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = __importStar(require("discord.js"));
const command_1 = __importDefault(require("../../../structures/command"));
async function execute(bot, message, args, command, data) {
    const state = message.options.getSubcommand();
    const embed = new discord_js_1.default.EmbedBuilder()
        .setAuthor({
        name: message.user.tag,
        iconURL: message.user.displayAvatarURL()
    })
        .setColor(discord_js_1.Colors.Green)
        .setTimestamp();
    if (state === "create") {
        const name = message.options.getString("name");
        const content = message.options.getString("content");
        data.guild.tags.push({
            name,
            content: content.replace("<br>", "\n")
        });
        data.guild.markModified("tags");
        await data.guild.save();
        embed.setDescription(`**Tag Created**\nSuccessfully created a new tag called **${name}**.`);
    }
    else if (state === "view") {
        const name = message.options.getString("name");
        const tag = data.guild.tags.find((t) => t.name.toLowerCase() === name.toLowerCase());
        if (!tag)
            return await message.editT(`${bot.config.emojis.error} | That tag doesn't exist!`);
        embed.setDescription(`**${tag.name}**\n${tag.content.replace("<br>", "\n")}`).setColor(discord_js_1.Colors.Blue);
    }
    else if (state === "list") {
        if (data.guild?.tags?.length < 1)
            return await message.editT(`${bot.config.emojis.error} | There are no tags for this server!`);
        embed.setDescription(`**Server Tags**\n${data.guild?.tags.map((tag) => tag.name).setColor(discord_js_1.Colors.Blue)}`);
    }
    else if (state === "delete") {
        const name = message.options.getString("name");
        const tag = data.guild.tags.find((tag) => tag.name.toLowerCase() === name.toLowerCase());
        if (!tag)
            return await message.editT(`${bot.config.emojis.error} | That tag doesn't exist!`);
        data.guild.tags = data.guild.tags.filter((tag) => tag.name.toLowerCase() !== name.toLowerCase());
        data.guild.markModified("tags");
        await data.guild.save();
        embed.setDescription(`**Deleted ${tag.name}**\nI successfully deleted **${tag.name}**.`).setColor(discord_js_1.Colors.Red);
    }
    await message.replyT({ embeds: [embed] });
}
exports.default = new command_1.default(execute, {
    description: "Create, view, or delete a tag.",
    dirname: __dirname,
    aliases: [],
    usage: "(create) (name) (content)",
    slash: false,
    enabled: false,
    options: [{
            type: 1,
            name: "create",
            description: "Create a tag.",
            options: [{
                    type: 3,
                    name: "name",
                    description: "The name of the tag.",
                    required: true
                }, {
                    type: 3,
                    name: "content",
                    description: "The content of the tag. PRO TIP: use <br> to create a new line.",
                    required: true
                }]
        }, {
            type: 1,
            name: "view",
            description: "View a tag.",
            options: [{
                    type: 3,
                    name: "name",
                    description: "The name of the tag to view.",
                    required: true
                }]
        }, {
            type: 1,
            name: "list",
            description: "List the guild's tags."
        }, {
            type: 1,
            name: "delete",
            description: "Delete a tag.",
            options: [{
                    type: 3,
                    name: "name",
                    description: "The name of the tag to delete.",
                    required: true
                }]
        }]
});
//# sourceMappingURL=tag.js.map