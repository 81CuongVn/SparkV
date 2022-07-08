"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const command_1 = __importDefault(require("../../../Structures/command"));
async function execute(bot, message, args, command, data) {
    const state = data.options.getSubcommand();
    if (state === "tickets") {
        await message.channel.send({
            embeds: [{
                    title: data.options.getString("title") || await message.translate(`${bot.config.emojis.ticket} | Get Support`),
                    description: data.options.getString("description") || await message.translate("Need help? Click the button below to create a support ticket."),
                    color: data.options.getString("color") || discord_js_1.Colors.Blue
                }],
            components: [{
                    type: 1,
                    components: [{
                            type: 2,
                            label: await message.translate("Create Ticket"),
                            emoji: bot.config.emojis.ticket,
                            style: 2,
                            customId: "ticket_create"
                        }]
                }]
        });
        const category = await message.guild.channels.cache.find((c) => (c.name.toLowerCase().includes("support") || c.name.toLowerCase().includes("tickets")) && c.type === "GUILD_CATEGORY") || await message.guild.channels.create("Tickets", { type: "GUILD_CATEGORY" });
        data.guild.tickets.category = category.id;
        data.guild.markModified("tickets.category");
        await data.guild.save();
        await message.replyT(`${bot.config.emojis.success} | Successfully created ticket panel.`);
    }
    else if (state === "roles") {
        const buttons = [];
        buttons.push({
            type: 2,
            label: data.options.getString("role1_text") || "React to get a role",
            customId: `role_${await data.options.getRole("role1").id}`,
            style: 2,
            emoji: data.options.getString("role1_emoji") || null,
            url: null,
            disabled: false
        });
        if (data.options.getRole("role2") && data.options.getString("role2_text")) {
            buttons.push({
                type: 2,
                label: data.options.getString("role2_text") || "React to get a role",
                customId: `role_${await data.options.getRole("role2").id}`,
                style: 2,
                emoji: data.options.getString("role2_emoji") || null,
                url: null,
                disabled: false
            });
        }
        if (data.options.getRole("role3") && data.options.getString("role3_text")) {
            buttons.push({
                type: 2,
                label: data.options.getString("role3_text") || "React to get a role",
                customId: `role_${await data.options.getRole("role3").id}`,
                style: 2,
                emoji: data.options.getString("role3_emoji") || null,
                url: null,
                disabled: false
            });
        }
        if (data.options.getRole("role4") && data.options.getString("role4_text")) {
            buttons.push({
                type: 2,
                label: data.options.getString("role4_text") || "React to get a role",
                customId: `role_${await data.options.getRole("role4").id}`,
                style: 2,
                emoji: data.options.getString("role4_emoji") || null,
                url: null,
                disabled: false
            });
        }
        if (data.options.getRole("role5") && data.options.getString("role5_text")) {
            buttons.push({
                type: 2,
                label: data.options.getString("role5_text") || "React to get a role",
                customId: `role_${await data.options.getRole("role5").id}`,
                style: 2,
                emoji: data.options.getString("role5_emoji") || null,
                url: null,
                disabled: false
            });
        }
        await message.channel.send({
            embeds: [
                {
                    title: data.options.getString("title") || `${bot.config.emojis.special} | Role Select`,
                    description: data.options.getString("description") || "Click the button(s) below to give yourself a role!",
                    color: data.options.getString("color") || discord_js_1.Colors.Blue
                }
            ],
            components: [
                {
                    type: 1,
                    components: buttons
                }
            ]
        });
        await message.replyT(`${bot.config.emojis.success} | Successfully created roles select panel.`);
    }
    else if (state === "embed") {
        await message.channel.send({
            embeds: [{
                    title: data.options.getString("title"),
                    description: data.options.getString("description").replaceAll("<br>", "\n"),
                    color: data.options.getString("color") || discord_js_1.Colors.Blue,
                    thumbnail: { url: data.options.getString("image") }
                }]
        });
        await message.replyT(`${bot.config.emojis.success} | Successfully created embed.`);
    }
}
exports.default = new command_1.default(execute, {
    description: "Set up a feature. (tickets, roles, embed)",
    dirname: __dirname,
    aliases: [],
    perms: ["ManageGuild"],
    usage: "(tickets|roles|embed) (title|description|color)",
    slash: true,
    ephemeral: true,
    options: [{
            type: 1,
            name: "tickets",
            description: "Allow users to open a ticket in your server.",
            options: [{
                    type: 3,
                    name: "title",
                    description: "The title to the ticket embed."
                }, {
                    type: 3,
                    name: "description",
                    description: "The description to the ticket embed."
                }, {
                    type: 3,
                    name: "color",
                    description: "The color to ALL the ticket embeds.",
                    choices: [{
                            name: "white",
                            value: "WHITE"
                        }, {
                            name: "aqua",
                            value: "AQUA"
                        }, {
                            name: "dark_aqua",
                            value: "DARK_AQUA"
                        }, {
                            name: "blue",
                            value: "BLUE"
                        }, {
                            name: "dark_blue",
                            value: "DARK_BLUE"
                        }, {
                            name: "green",
                            value: "GREEN"
                        }, {
                            name: "dark_green",
                            value: "DARK_GREEN"
                        }, {
                            name: "purple",
                            value: "PURPLE"
                        }, {
                            name: "dark_purple",
                            value: "DARK_PURPLE"
                        }, {
                            name: "yellow",
                            value: "YELLOW"
                        }, {
                            name: "gold",
                            value: "GOLD"
                        }, {
                            name: "dark_gold",
                            value: "DARK_GOLD"
                        }, {
                            name: "orange",
                            value: "ORANGE"
                        }, {
                            name: "dark_orange",
                            value: "DARK_ORANGE"
                        }, {
                            name: "red",
                            value: "RED"
                        }, {
                            name: "dark_red",
                            value: "DARK_RED"
                        }, {
                            name: "grey",
                            value: "GREY"
                        }, {
                            name: "dark_GREY",
                            value: "DARK_GREY"
                        }, {
                            name: "darker_grey",
                            value: "DARKER_GREY"
                        }, {
                            name: "light_grey",
                            value: "LIGHT_GREY"
                        }, {
                            name: "navy",
                            value: "NAVY"
                        }, {
                            name: "dark_navy",
                            value: "DARK_NAVY"
                        }, {
                            name: "blurple",
                            value: "BLURPLE"
                        }, {
                            name: "random",
                            value: "RANDOM"
                        }]
                }]
        }, {
            type: 1,
            name: "roles",
            description: "Create a message that allows you to get roles by clicking a button.",
            options: [{
                    type: 8,
                    name: "role1",
                    description: "The first role button.",
                    required: true
                }, {
                    type: 3,
                    name: "role1_text",
                    description: "The first role button's text.",
                    required: true
                }, {
                    type: 3,
                    name: "role1_emoji",
                    description: "The emoji to use for the first role button."
                }, {
                    type: 8,
                    name: "role2",
                    description: "The second role button."
                }, {
                    type: 3,
                    name: "role2_text",
                    description: "The second role button's text."
                }, {
                    type: 3,
                    name: "role2_emoji",
                    description: "The emoji to use for the second role button."
                }, {
                    type: 8,
                    name: "role3",
                    description: "The third role button."
                }, {
                    type: 3,
                    name: "role3_text",
                    description: "The third role button's text."
                }, {
                    type: 3,
                    name: "role3_emoji",
                    description: "The emoji to use for the third role button."
                }, {
                    type: 8,
                    name: "role4",
                    description: "The fourth role button."
                }, {
                    type: 3,
                    name: "role4_text",
                    description: "The fourth role button's text."
                }, {
                    type: 3,
                    name: "role4_emoji",
                    description: "The emoji to use for the fourth role button."
                }, {
                    type: 8,
                    name: "role5",
                    description: "The fifth role button."
                }, {
                    type: 3,
                    name: "role5_text",
                    description: "The fifth role button's text."
                }, {
                    type: 3,
                    name: "role5_emoji",
                    description: "The emoji to use for the fifth role button."
                }, {
                    type: 3,
                    name: "title",
                    description: "The title to the ticket embed."
                }, {
                    type: 3,
                    name: "description",
                    description: "The description to the ticket embed."
                }, {
                    type: 3,
                    name: "color",
                    description: "The color to ALL the ticket embeds.",
                    choices: [{
                            name: "white",
                            value: "WHITE"
                        }, {
                            name: "aqua",
                            value: "AQUA"
                        }, {
                            name: "dark_aqua",
                            value: "DARK_AQUA"
                        }, {
                            name: "blue",
                            value: "BLUE"
                        }, {
                            name: "dark_blue",
                            value: "DARK_BLUE"
                        }, {
                            name: "green",
                            value: "GREEN"
                        }, {
                            name: "dark_green",
                            value: "DARK_GREEN"
                        }, {
                            name: "purple",
                            value: "PURPLE"
                        }, {
                            name: "dark_purple",
                            value: "DARK_PURPLE"
                        }, {
                            name: "yellow",
                            value: "YELLOW"
                        }, {
                            name: "gold",
                            value: "GOLD"
                        }, {
                            name: "dark_gold",
                            value: "DARK_GOLD"
                        }, {
                            name: "orange",
                            value: "ORANGE"
                        }, {
                            name: "dark_orange",
                            value: "DARK_ORANGE"
                        }, {
                            name: "red",
                            value: "RED"
                        }, {
                            name: "dark_red",
                            value: "DARK_RED"
                        }, {
                            name: "grey",
                            value: "GREY"
                        }, {
                            name: "dark_GREY",
                            value: "DARK_GREY"
                        }, {
                            name: "darker_grey",
                            value: "DARKER_GREY"
                        }, {
                            name: "light_grey",
                            value: "LIGHT_GREY"
                        }, {
                            name: "navy",
                            value: "NAVY"
                        }, {
                            name: "dark_navy",
                            value: "DARK_NAVY"
                        }, {
                            name: "blurple",
                            value: "BLURPLE"
                        }, {
                            name: "random",
                            value: "RANDOM"
                        }]
                }]
        }, {
            type: 1,
            name: "embed",
            description: "Create an embed.",
            options: [{
                    type: 3,
                    name: "description",
                    description: "The description for the embed.",
                    required: true
                }, {
                    type: 3,
                    name: "title",
                    description: "The title for the embed."
                }, {
                    type: 3,
                    name: "image",
                    description: "The image for the embed. Please use a valid URL containing https:// in the start."
                }, {
                    type: 3,
                    name: "color",
                    description: "The color to ALL the ticket embeds.",
                    choices: [{
                            name: "white",
                            value: "WHITE"
                        }, {
                            name: "aqua",
                            value: "AQUA"
                        }, {
                            name: "dark_aqua",
                            value: "DARK_AQUA"
                        }, {
                            name: "blue",
                            value: "BLUE"
                        }, {
                            name: "dark_blue",
                            value: "DARK_BLUE"
                        }, {
                            name: "luminous_vivid_pink",
                            value: "LUMINOUS_VIVID_PINK"
                        }, {
                            name: "green",
                            value: "GREEN"
                        }, {
                            name: "dark_green",
                            value: "DARK_GREEN"
                        }, {
                            name: "purple",
                            value: "PURPLE"
                        }, {
                            name: "dark_purple",
                            value: "DARK_PURPLE"
                        }, {
                            name: "yellow",
                            value: "YELLOW"
                        }, {
                            name: "gold",
                            value: "GOLD"
                        }, {
                            name: "dark_gold",
                            value: "DARK_GOLD"
                        }, {
                            name: "orange",
                            value: "ORANGE"
                        }, {
                            name: "dark_orange",
                            value: "DARK_ORANGE"
                        }, {
                            name: "red",
                            value: "RED"
                        }, {
                            name: "dark_red",
                            value: "DARK_RED"
                        }, {
                            name: "grey",
                            value: "GREY"
                        }, {
                            name: "dark_GREY",
                            value: "DARK_GREY"
                        }, {
                            name: "darker_grey",
                            value: "DARKER_GREY"
                        }, {
                            name: "light_grey",
                            value: "LIGHT_GREY"
                        }, {
                            name: "navy",
                            value: "NAVY"
                        }, {
                            name: "dark_navy",
                            value: "DARK_NAVY"
                        }, {
                            name: "blurple",
                            value: "BLURPLE"
                        }, {
                            name: "random",
                            value: "RANDOM"
                        }]
                }]
        }]
});
//# sourceMappingURL=panel.js.map