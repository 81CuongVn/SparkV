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
const axios_1 = __importDefault(require("axios"));
const command_1 = __importDefault(require("../../../structures/command"));
const words_json_1 = __importDefault(require("../../../words.json"));
function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}
async function execute(bot, message, args, command, data) {
    const type = data.options.getString("type");
    const embed = new discord_js_1.default.EmbedBuilder()
        .setAuthor({
        name: message.user.tag,
        iconURL: message.user.displayAvatarURL()
    })
        .setColor(discord_js_1.Colors.Green)
        .setTimestamp();
    switch (type) {
        case "8ball": {
            const replies = [
                "It is certain",
                "It is decidedly so",
                "Without a doubt",
                "Yes, definitely",
                "You may rely on it",
                "As I see it, yes",
                "Most likely",
                "Outlook good",
                "Yes",
                "Signs pointing to yes",
                "Ask again later",
                "Better not tell you now",
                "Cannot predict now",
                "Concentrate and ask again",
                "Don't count on it",
                "My reply is no",
                "My sources say no",
                "Outlook not so good",
                "very doubtful"
            ];
            const goodReplies = [
                "It is certain",
                "It is decidedly so",
                "Without a doubt",
                "Yes, definitely",
                "You may rely on it",
                "As I see it, yes",
                "Most likely",
                "Outlook good",
                "Yes",
                "Signs pointing to yes"
            ];
            const reply = replies[Math.floor(Math.random() * replies.length + 0)];
            await message.replyT({
                embeds: [embed.setDescription(`**8Ball**\n${reply}`).setColor(goodReplies.find(r => r === reply) ? discord_js_1.Colors.Green : discord_js_1.Colors.Red)]
            });
            break;
        }
        case "advice": {
            const data = await axios_1.default.get("https://api.adviceslip.com/advice").then(res => res.data).catch((err) => bot.logger(`Advice failed: ${err}`, "error"));
            await message.replyT({
                embeds: [embed.setDescription(`**Here's an advice.**\n${data.slip.advice}`).setFooter({ text: `You got advice #${data.slip.id}`, iconURL: bot.user.displayAvatarURL() })]
            });
            break;
        }
        case "uselessfact": {
            const data = await axios_1.default.get("https://uselessfacts.jsph.pl/random.json?language=en").then(res => res.data).catch((err) => bot.logger(`Useless fact failed: ${err}`, "error"));
            await message.replyT({
                embeds: [embed.setDescription(`**${bot.config.emojis.question} | Did you know?**\n${data.text}`).setFooter({ text: `Fun facts powered by uselessfacts.jsph.pl! • ${bot.config.embed.footer}`, iconURL: bot.user.displayAvatarURL() })]
            });
            break;
        }
        case "truthordare": {
            const msg = await message.replyT({
                embeds: [embed.setDescription(`${bot.config.emojis.question} | **Truth or Dare?**\nSelect whether you want truth or dare.`)],
                components: [{
                        type: 1,
                        components: [
                            new discord_js_1.default.ButtonBuilder()
                                .setLabel("Truth")
                                .setStyle(discord_js_1.ButtonStyle.Success)
                                .setCustomId("truth"),
                            new discord_js_1.default.ButtonBuilder()
                                .setLabel("Dare")
                                .setStyle(discord_js_1.ButtonStyle.Danger)
                                .setCustomId("dare")
                        ]
                    }],
                fetchReply: true
            });
            const collector = msg.createMessageComponentCollector({ time: 300 * 1000 });
            collector.on("collect", async (interaction) => {
                if (!interaction.deferred)
                    interaction.deferUpdate().catch(() => { });
                const data = await axios_1.default.get(`https://api.truthordarebot.xyz/api/${interaction.customId}`).then(res => res.data).catch((err) => bot.logger(`Truth or dare failed: ${err}`, "error"));
                await msg.edit({
                    embeds: [embed
                            .setDescription(`${bot.config.emojis.question} | **Truth or Dare?**\n${data.question}`)
                            .setColor(interaction.customId === "truth" ? discord_js_1.Colors.Green : discord_js_1.Colors.Red)],
                    components: []
                });
            });
            collector.on("end", async () => { });
            break;
        }
        case "hangman": {
            const word = words_json_1.default[Math.floor(Math.random() * words_json_1.default.length)];
            const lettersRegExp = new RegExp(`^[A-Za-zÀ-ú](?:.{0}|.{${word.length - 1}})$`);
            let menuEmbed;
            let gameOver = false;
            let gameStatus = "playing";
            let progress = "_".repeat(word.length);
            let lives = 6;
            let remaining = word.length;
            const misses = [];
            // eslint-disable-next-line no-inner-declarations
            async function updateGame() {
                const embed = new discord_js_1.default.EmbedBuilder()
                    .setAuthor({
                    name: message.user.tag,
                    iconURL: message.user.displayAvatarURL()
                })
                    .setTitle(await message.translate("Hangman"))
                    .setDescription(`\`\`\`
        +--+
        |  |
        |  ${lives < 6 ? "0" : " "}
        | ${lives < 3 ? "/" : " "}${lives < 5 ? "|" : " "}${lives < 4 ? "\\" : " "}
        | ${lives < 2 ? "/" : " "} ${lives < 1 ? "\\" : " "}
        |
    ---------
			\`\`\`\n${gameOver ? `${(gameStatus === await message.translate("won") ? await message.translate("You won!") : await message.translate("You lost. Better luck next time."))} ${await message.translate("The word was")} \`${word}\`` : await message.translate("You got this!")}`)
                    .addFields([
                    {
                        name: await message.translate("Word"),
                        value: `\`${progress}\``,
                        inline: false
                    },
                    {
                        name: await message.translate("Guesses"),
                        value: `${misses.join(", ") || "None."}`,
                        inline: true
                    },
                    {
                        name: await message.translate("Lives"),
                        value: `${"❤️".repeat(lives >= 0 ? lives : 0)}${"🖤".repeat(6 - lives)}`,
                        inline: true
                    }
                ])
                    .setColor(gameOver ? (gameStatus === "won" ? discord_js_1.Colors.Green : discord_js_1.Colors.Red) : discord_js_1.Colors.Blue);
                if (menuEmbed) {
                    await menuEmbed.edit({
                        embeds: [embed]
                    });
                }
                else {
                    menuEmbed = await message.replyT({
                        embeds: [embed]
                    });
                }
            }
            await updateGame();
            const collector = await menuEmbed.channel.createMessageCollector({ time: 900 * 1000 });
            collector.on("collect", async (m) => {
                if (m.content.toLowerCase() === "cancel")
                    await collector.stop();
                if (!m.content.match(lettersRegExp))
                    return;
                const guess = m.content.toLowerCase();
                if (guess.length === 1) {
                    if (misses.includes(`\`${guess}\``)) {
                        await m.replyT(`\`${guess}\` ${await message.translate("has already been guessed. Try again!")}`).then(async (m) => setTimeout(() => m.delete(), 5000));
                        return setTimeout(() => m.delete(), 5000);
                    }
                    if (word.includes(guess)) {
                        for (let i = 0; i < word.length; ++i) {
                            if (word[i] === guess) {
                                progress = `${progress.substring(0, i)}${word[i]}${progress.substring(i + word[i].length)}`;
                                remaining--;
                            }
                        }
                    }
                    else {
                        !misses.includes(guess) && misses.push(`\`${guess}\``);
                        lives--;
                    }
                    if (lives === 0)
                        gameStatus = "lost";
                    else if (remaining === 0)
                        gameStatus = "won";
                    m.delete();
                }
                await updateGame();
                if (gameStatus !== "playing")
                    await collector.stop();
            });
            collector.on("end", async (collected) => {
                gameOver = true;
                await updateGame();
            });
            break;
        }
        case "spelling": {
            let chosenWord = "";
            chosenWord += `${words_json_1.default[Math.floor(Math.random() * words_json_1.default.length)]} `;
            chosenWord += `${words_json_1.default[Math.floor(Math.random() * words_json_1.default.length)]} `;
            chosenWord += `${words_json_1.default[Math.floor(Math.random() * words_json_1.default.length)]} `;
            chosenWord += `${words_json_1.default[Math.floor(Math.random() * words_json_1.default.length)]}`;
            const gameCreation = Date.now();
            const MenuEmbed = new discord_js_1.default.EmbedBuilder()
                .setAuthor({
                name: message.user.tag,
                iconURL: message.user.displayAvatarURL()
            })
                .setDescription(`**Spelling Game**\nYou have **1 minute** to spell the following word correctly.\n> **\`${chosenWord}\`**.`)
                .setColor(discord_js_1.Colors.Blue)
                .setTimestamp();
            const Menu = await message.replyT({
                embeds: [MenuEmbed]
            });
            const Guess = await message.channel.awaitMessages({
                filter: (m) => {
                    if (m.author.bot)
                        return false;
                    if (!m?.content)
                        return false;
                    return true;
                },
                max: 1,
                time: 60 * 1000,
                errors: ["time"]
            }).then(async (collected) => {
                const colMessage = collected.first();
                const embed = new discord_js_1.default.EmbedBuilder()
                    .setAuthor({
                    name: message.user.tag,
                    iconURL: message.user.displayAvatarURL()
                })
                    .setTimestamp();
                if (colMessage.content.toLowerCase() === chosenWord.toLowerCase()) {
                    const time = ((Date.now() - gameCreation) / 1000);
                    const seconds = (time % 60).toFixed(2);
                    const WPM = (colMessage.content.toLowerCase().trim().length / 5 / (time / 60)).toFixed(2);
                    await Menu.edit({
                        embeds: [
                            MenuEmbed
                                .setDescription(`${MenuEmbed.description}\n\n${bot.config.emojis.success} | ${colMessage.author} ${await message.translate("has won the game in")} **${seconds} ${await message.translate("seconds")}** ${await message.translate("with a WPM of ")}**${WPM}**!`)
                                .setColor(discord_js_1.Colors.Green)
                        ]
                    });
                    embed
                        .setDescription(`${bot.config.emojis.success} | ${await message.translate("Great job! The answer was ")}\`${chosenWord}\`. You got it right in **${seconds} seconds** with a WPM of **${WPM}**!`)
                        .setColor(discord_js_1.Colors.Green);
                }
                else {
                    await Menu.edit({
                        embeds: [
                            MenuEmbed
                                .setDescription(`${MenuEmbed.description}\n\n${bot.config.emojis.error} | ${colMessage.author} ${await message.translate("spelt the word wrong, and lost the game")}.`)
                                .setColor(discord_js_1.Colors.Red)
                        ]
                    });
                    embed
                        .setDescription(`${bot.config.emojis.error} | ${await message.translate("That's not right... better luck next time. The words were ")}\`${chosenWord}\`.`)
                        .setColor(discord_js_1.Colors.Red);
                }
                await message.replyT({
                    embeds: [embed]
                });
            }).catch((err) => {
                bot.logger(err, "error");
                message.replyT("⏰ | The game has been cancelled because nobody replied in time.");
            });
            break;
        }
        case "trivia": {
            const trivia = await message.replyT({
                embeds: [
                    new discord_js_1.default.EmbedBuilder()
                        .setAuthor({
                        name: message.user.tag,
                        iconURL: message.user.displayAvatarURL()
                    })
                        .setTitle(await message.translate(`${bot.config.emojis.config} | Loading...`))
                        .setDescription(await message.translate(`Please wait...`))
                        .setFooter({
                        text: bot.config.embed.footer,
                        iconURL: bot.user.displayAvatarURL()
                    })
                        .setColor(discord_js_1.Colors.Blue)
                ]
            });
            const triviaData = await axios_1.default.get(`https://opentdb.com/api.php?amount=1&type=multiple`).then(res => res.data.results[0]);
            const choices = [];
            triviaData.incorrect_answers.forEach(async (answer) => choices.push(await message.translate(answer)));
            choices.push(await message.translate(triviaData.correct_answer));
            shuffle(choices);
            let number = 0;
            const triviaEmbed = new discord_js_1.default.EmbedBuilder()
                .setAuthor({
                name: message.user.tag,
                iconURL: message.user.displayAvatarURL()
            })
                .setDescription(`${bot.config.emojis.question} | **${await message.translate(triviaData.question.replaceAll("&quot;", "\"").replaceAll("&#039;", "\'"))}**\n${await message.translate("You only have")} **${await message.translate("1 minute")}** ${await message.translate("to guess the answer!")}\n\n${choices.map(choice => {
                number++;
                return `**${number}**) ${choice.replaceAll("&quot;", "\"").replaceAll("&#039", "\'")}`;
            }).join("\n")}`)
                .setColor(discord_js_1.Colors.Blue);
            const answer1B = new discord_js_1.default.ButtonBuilder()
                .setEmoji("1️⃣")
                .setCustomId("1")
                .setStyle(discord_js_1.ButtonStyle.Secondary);
            const answer2B = new discord_js_1.default.ButtonBuilder()
                .setEmoji(bot.config.emojis.numbers.two)
                .setCustomId("2")
                .setStyle(discord_js_1.ButtonStyle.Secondary);
            const answer3B = new discord_js_1.default.ButtonBuilder()
                .setEmoji("3️⃣")
                .setCustomId("3")
                .setStyle(discord_js_1.ButtonStyle.Secondary);
            const answer4B = new discord_js_1.default.ButtonBuilder()
                .setEmoji("4️⃣")
                .setCustomId("4")
                .setStyle(discord_js_1.ButtonStyle.Secondary);
            await trivia.edit({
                embeds: [triviaEmbed],
                components: [
                    {
                        type: 1,
                        components: [answer1B, answer2B, answer3B, answer4B]
                    }
                ],
                fetchReply: true
            });
            const collector = trivia.createMessageComponentCollector({ time: 60 * 1000 });
            collector.on("collect", async (interaction) => {
                await interaction.deferReply();
                const embed = new discord_js_1.default.EmbedBuilder()
                    .setAuthor({
                    name: message.user.tag,
                    iconURL: message.user.displayAvatarURL()
                })
                    .setTimestamp();
                const winningNumber = choices.indexOf(triviaData.correct_answer);
                if ((parseInt(interaction.customId) - 1) === winningNumber) {
                    embed
                        .setDescription(`${bot.config.emojis.success} | ${await message.translate("Great job! The answer was ")}**${triviaData.correct_answer}**!`)
                        .setColor(discord_js_1.Colors.Green);
                }
                else {
                    embed
                        .setDescription(`${bot.config.emojis.error} | ${await message.translate("That's not right... better luck next time. The answer was ")}**${triviaData.correct_answer}**.`)
                        .setColor(discord_js_1.Colors.Red);
                    if ((parseInt(interaction.customId) - 1) === 0)
                        answer1B.setStyle(discord_js_1.ButtonStyle.Danger);
                    else if ((parseInt(interaction.customId) - 1) === 1)
                        answer2B.setStyle(discord_js_1.ButtonStyle.Danger);
                    else if ((parseInt(interaction.customId) - 1) === 2)
                        answer3B.setStyle(discord_js_1.ButtonStyle.Danger);
                    else if ((parseInt(interaction.customId) - 1) === 3)
                        answer4B.setStyle(discord_js_1.ButtonStyle.Danger);
                }
                if (winningNumber === 0)
                    answer1B.setStyle(discord_js_1.ButtonStyle.Success);
                else if (winningNumber === 1)
                    answer2B.setStyle(discord_js_1.ButtonStyle.Success);
                else if (winningNumber === 2)
                    answer3B.setStyle(discord_js_1.ButtonStyle.Success);
                else if (winningNumber === 3)
                    answer4B.setStyle(discord_js_1.ButtonStyle.Success);
                await trivia.edit({
                    components: [
                        {
                            type: 1,
                            components: [answer1B.setDisabled(true), answer2B.setDisabled(true), answer3B.setDisabled(true), answer4B.setDisabled(true)]
                        }
                    ]
                });
                await interaction.replyT({
                    embeds: [embed]
                });
            });
            break;
        }
    }
}
exports.default = new command_1.default(execute, {
    description: "Just a little fun.",
    dirname: __dirname,
    aliases: [],
    usage: "(type)",
    slash: true,
    options: [
        {
            type: 3,
            name: "type",
            description: "The type of fun you want to have.",
            required: true,
            choices: [
                {
                    name: "8ball",
                    value: "8ball"
                },
                {
                    name: "advice",
                    value: "advice"
                },
                {
                    name: "uselessfact",
                    value: "uselessfact"
                },
                {
                    name: "truth_or_dare",
                    value: "truthordare"
                },
                {
                    name: "hangman",
                    value: "hangman"
                },
                {
                    name: "trivia",
                    value: "trivia"
                },
                {
                    name: "spelling",
                    value: "spelling"
                },
                {
                    name: "akinator",
                    value: "akinator"
                }
            ]
        }
    ]
});
//# sourceMappingURL=fun.js.map