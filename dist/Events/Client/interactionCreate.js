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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const cooldowns = [];
exports.default = {
    once: false,
    async execute(bot, interaction) {
        if (interaction.type === discord_js_1.InteractionType.ApplicationCommand) {
            const command = bot.commands.get(interaction.commandName);
            if (!command)
                return;
            try {
                if (interaction) {
                    await interaction.deferReply({
                        ephemeral: command.settings.ephemeral || false
                    });
                }
                else {
                    return;
                }
            }
            catch (err) {
                return;
            }
            const data = {};
            if (interaction.inGuild()) {
                data.guild = await bot.database.getGuild(interaction.guild.id);
                data.member = await bot.database.getMember(interaction.user.id, interaction.guild.id);
            }
            data.user = await bot.database.getUser(interaction.user.id);
            data.options = interaction.options;
            if (!data)
                return;
            // Cooldown System
            if (!cooldowns[interaction.user.id])
                cooldowns[interaction.user.id] = [];
            const time = cooldowns[interaction.user.id][command.settings.name] || 0;
            if (time && (time > Date.now())) {
                const cooldownEmbed = new discord_js_1.default.EmbedBuilder()
                    .setAuthor({
                    name: interaction.user.tag,
                    iconURL: interaction.user.displayAvatarURL()
                })
                    .setTitle(`${bot.config.emojis.error} | Whoa there ${interaction.user.username}!`)
                    .setDescription(`Please wait **${((time - Date.now()) / 1000 % 60).toFixed(2)} **more seconds to use that command again.`)
                    .setThumbnail(interaction.user.displayAvatarURL())
                    .setColor(discord_js_1.Colors.Red)
                    .setFooter({
                    text: bot.config.embed.footer,
                    iconURL: bot.user.displayAvatarURL()
                });
                return await interaction.replyT({
                    embeds: [cooldownEmbed]
                });
            }
            cooldowns[interaction.user.id][command.settings.name] = Date.now() + command.settings.cooldown;
            if (!command.settings.options)
                command.settings.options = [];
            if (command.settings.enabled === false)
                return await interaction.replyT(`${bot.config.emojis.error} | This command is currently disabled! Please try again later.`);
            if (command.settings.guildOnly && !interaction.guild)
                return await interaction.replyT("This command is guild only. Please join a server with SparkV in it or invite SparkV to your own server.");
            if (command.settings.ownerOnly && !bot.config.owners.includes(interaction.user.id))
                return await interaction.replyT("This command is restricted. Only the owners (KingCh1ll, Unbreakablenight) can use this command.");
            bot.StatClient.postCommand(command.settings.name, interaction.user.id, process.argv.includes("--sharding") === true && bot);
            try {
                await command.run(bot, interaction, [], interaction.commandName, data);
            }
            catch (error) {
                bot.logger(error, "error");
                const ErrorEmbed = new discord_js_1.default.EmbedBuilder()
                    .setAuthor({
                    name: interaction.user.tag,
                    iconURL: interaction.user.displayAvatarURL()
                })
                    .setTitle("Uh oh!")
                    .setDescription(`**An error occured while trying to run this command. Please contact support [here](https://discord.gg/PPtzT8Mu3h).**\n\n${error.message}`)
                    .addFields([{ name: "**Error**", value: `\`\`\`${error.message}\`\`\``, inline: true }])
                    .setColor(discord_js_1.Colors.Red);
                await interaction.replyT({
                    embeds: [ErrorEmbed],
                    ephemeral: true
                });
            }
        }
        else if (interaction.isButton()) {
            for (const file of fs_1.default.readdirSync(`${process.env.MainDir}/Interactions/Buttons`)) {
                if (interaction.customId.startsWith(file.split(".")[0]) || interaction.customId.includes(file.split(".")[0])) {
                    const event = require(path_1.default.resolve(`${process.env.MainDir}/Interactions/Buttons/${file}`));
                    event.execute(bot, interaction);
                }
            }
        }
    }
};
//# sourceMappingURL=interactionCreate.js.map