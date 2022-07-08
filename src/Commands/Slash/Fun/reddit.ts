import discord, { Colors } from "discord.js";
import axios from "axios";

import cmd from "../../.././structures/command";

const subreddits = [{
    name: "meme",
    color: Colors.Yellow,
    choices: [{
        name: "Memes",
        id: "reddit_0__0",
        url: "/r/memes/top/.json?sort=top&t=day",
    }, {
        name: "Dank Memes",
        id: "reddit_0__1",
        url: "/r/dankmemes/top/.json?sort=top&t=day",
    }, {
        name: "Meme Economy",
        id: "reddit_0__2",
        url: "/r/MemeEconomy/top/.json?sort=top&t=day",
    }, {
        name: "Prequel Memes",
        id: "reddit_0__3",
        url: "/r/PrequelMemes/top/.json?sort=top&t=day",
    }, {
        name: "Me Irl",
        id: "reddit_0__4",
        url: "/r/me_irl/top/.json?sort=top&t=day",
    }, {
        name: "Go Commit Die",
        id: "reddit_0__5",
        url: "/r/gocommitdie/top/.json?sort=top&t=day",
    }, {
        name: "Comedy Cemetery",
        id: "reddit_0__6",
        url: "/r/ComedyCemetery/top/.json?sort=top&t=day",
    }, {
        name: "Advice Animals",
        id: "reddit_0__7",
        url: "/r/AdviceAnimals/top/.json?sort=top&t=day",
    }, {
        name: "Monke",
        id: "reddit_0__8",
        url: "/r/Monke/top/.json?sort=top&t=day",
    }]
}, {
    name: "animal",
    description: "I will send a cute picture of an animal. Awww!",
    color: Colors.DarkGold,
    choices: [{
        name: "Bunnies",
        id: "reddit_1__0",
        url: "/r/bunnies/top/.json?sort=top&t=day"
    }, {
        name: "Dogs",
        id: "reddit_1__1",
        url: "https://www.reddit.com/r/dogpictures/top/.json?sort=top&t=day"
    }, {
        name: "Cats",
        id: "reddit_1__2",
        url: "/r/catpictures/top/.json?sort=top&t=day"
    }, {
        name: "Ducks",
        id: "reddit_1__3",
        url: "/r/Duckpictures/top/.json?sort=top&t=day"
    }, {
        name: "Foxes",
        id: "reddit_1__4",
        url: "/r/foxes/top/.json?sort=top&t=day"
    }, {
        name: "Monkeys",
        id: "reddit_1__5",
        url: "/r/monkeys/top/.json?sort=top&t=day"
    }]
}, {
    name: "food",
    description: "I will send some mouth-watering food. Yum!",
    color: Colors.Green,
    choices: [{
        name: "All Types of Food",
        id: "reddit_2__0",
        url: "/r/food/top/.json?sort=top&t=day"
    }, {
        name: "Cheeses",
        id: "reddit_2__1",
        url: "/r/Cheese/top/.json?sort=top&t=day"
    }, {
        name: "Tacos",
        id: "reddit_2__2",
        url: "/r/tacos/top/.json?sort=top&t=day"
    }, {
        name: "Pizzas",
        id: "reddit_2__3",
        url: "/r/pizza/top/.json?sort=top&t=day"
    }]
}, {
    name: "internet",
    description: "I will send some internet related posts.",
    color: Colors.Green,
    choices: [{
        name: "Comic",
        emoji: "💥",
        id: "reddit_3__0",
        url: "/r/comics/top/.json?sort=top&t=day"
    }, {
        name: "Discord",
        emoji: "<:discord:991695492276826222>",
        id: "reddit_3__1",
        url: "/r/discordapp/top/.json?sort=top&t=day"
    }, {
        name: "Daily Dose of Internet",
        id: "reddit_3__2",
        url: "/top/.json?sort=top&t=day"
    }, {
        name: "Pizzas",
        emoji: "🍕",
        id: "reddit_3__3",
        url: "/r/pizza/top/.json?sort=top&t=day"
    }]
}]

// const filters = {
// 	image: (post: any) => post.data.post_hint === "image",
// 	text: (post: any) => post.data.post_hint !== "image" && post.data.selftext.length <= 2000 && post.data.title.length <= 256
// };

export default new cmd(async (bot: any, message: any, args: string[], command: any, data: any) => {
    const mainComponents: any[] = [{
        type: 1,
        components: [{
            type: 2,
            label: await message.translate("Exit"),
            emoji: bot.config.emojis.leave,
            customId: "exit",
            style: 4
        }, {
            type: 2,
            label: await message.translate("Memes"),
            emoji: "😂",
            customId: "cat_0",
            style: 2
        }, {
            type: 2,
            label: await message.translate("Animal"),
            emoji: "🐶",
            customId: "cat_1",
            style: 2
        }, {
            type: 2,
            label: await message.translate("Food"),
            emoji: "🍕",
            customId: "cat_2",
            style: 2
        }, {
            type: 2,
            label: await message.translate("Internet"),
            emoji: bot.config.emojis.globe,
            customId: "cat_3",
            style: 2
        }]
    }];

    /* -------------------------------------------------- SEND MESSAGE --------------------------------------------------*/
    const msg = await message.replyT({
        embeds: [{
            title: `**${bot.config.emojis.reddit} Reddit**`,
            description: `> Select the subreddit you'd like to view.`,
            color: Colors.Blue
        }],
        components: mainComponents,
        fetchReply: true
    });

    /* -------------------------------------------------- HANDLE SUBREDDIT --------------------------------------------------*/
    async function subreddit(subreddit: string) {
        let res;

        const cache = await bot.redis.get(subreddit).then((res: any) => JSON.parse(res));
        if (cache) {
            res = cache;
        } else {
            res = await axios.get(`https://www.reddit.com${subreddit}`).then((res: any) => res.data).catch((): any => { });
            await bot.redis.set(subreddit, JSON.stringify(res), { EX: 60 * 1000 });
        }

        if (!res) return;

        // const post = res.data.children.filter(filters[this.settings.type as keyof typeof filters]);
        let selectedPost = res.data.children[Math.floor(Math.random() * Object.keys(res.data.children).length)];
        return selectedPost?.data;
    }

    /* -------------------------------------------------- HANDLE CHOICES --------------------------------------------------*/
    async function handleChoice(subdata: any) {
        let components: any[] = [{
            type: 1,
            components: [{ type: 2, label: await message.translate("Back"), emoji: bot.config.emojis.leave, customId: "backHome", style: 2 }]
        }];
        let rows: number = 0;
        await subdata.choices.forEach(async (choice: any) => {
            const button = {
                type: 2,
                label: await message.translate(choice.name),
                emoji: choice?.emoji,
                customId: choice.id,
                style: 2
            }

            if (!components[rows]) {
                components[rows] = {
                    type: 1,
                    components: [button]
                };
            } else if (components[rows]?.components?.length >= 5) {
                components.push({
                    type: 1,
                    components: [button]
                });

                ++rows;
            } else { components[rows].components.push(button); }
        });

        return components
    }

    /* -------------------------------------------------- HANDLE BUTTONS --------------------------------------------------*/
    const collector = msg.createMessageComponentCollector({ time: 1200 * 1000 });
    collector.on("collect", async (interaction: any) => {
        interaction.deferUpdate().catch((): any => { });

        if (interaction.customId.startsWith("cat_")) {
            const subdata: any = subreddits[parseInt(interaction.customId.split("_")[1])]
            const components = await handleChoice(subdata);

            await msg.edit({
                embeds: [{
                    title: `**${bot.config.emojis.reddit} Reddit**`,
                    description: `> Select the ${subdata.name} subreddit you'd like to view.`,
                    color: Colors.Yellow
                }],
                components
            });
        } else if (interaction.customId.startsWith("reddit_")) {
            const sub: any = subreddits[parseInt(interaction.customId.split("_")[1])]
            const subdata: any = sub.choices[parseInt(interaction.customId.split("__")[1])]

            const post = await subreddit(subdata.url);
            if (!post) return;

            await msg.edit({
                embeds: [{
                    title: post.title.length > 256 ? `${post.title.slice(0, 248)}...` : post.title,
                    url: `https://www.reddit.com${post.permalink}`,
                    image: { url: post.url },
                    footer: {
                        text: `👍${post.ups} | 💬${post.num_comments} | 😃u/${post.author} | ⚙️r/${post.subreddit}`,
                        iconURL: bot.user.displayAvatarURL()
                    },
                    color: Colors.Blue
                }],
                components: [{
                    type: 1,
                    components: [{
                        type: 2,
                        label: await message.translate("Back"),
                        emoji: bot.config.emojis.leave,
                        customId: "back",
                        style: 2
                    }, {
                        type: 2,
                        label: await message.translate("Refresh"),
                        emoji: bot.config.emojis.loop,
                        customId: "refresh",
                        style: 2
                    }]
                }]
            });

            const collector2 = msg.createMessageComponentCollector({ time: 1200 * 1000 });
            collector2.on("collect", async (interaction2: any) => {
                switch (interaction2.customId) {
                    case "back": {
                        await msg.edit({
                            embeds: [{
                                title: `**${bot.config.emojis.reddit} Reddit**`,
                                description: `> Select the ${sub.name} subreddit you'd like to view.`,
                                color: Colors.Yellow
                            }],
                            components: await handleChoice(sub)
                        });

                        return collector2.stop();
                    } case "refresh": {
                        const post = await subreddit(subdata.url);
                        if (!post) return;

                        await msg.edit({
                            embeds: [{
                                title: post.title.length > 256 ? `${post.title.slice(0, 248)}...` : post.title,
                                url: `https://www.reddit.com${post.permalink}`,
                                image: { url: post.url },
                                footer: {
                                    text: `👍${post.ups} | 💬${post.num_comments} | 😃u/${post.author} | ⚙️r/${post.subreddit}`,
                                    iconURL: bot.user.displayAvatarURL()
                                },
                                color: Colors.Blue
                            }]
                        });
                    }
                }
            });
        } else if (interaction.customId === "backHome") {
            await msg.edit({
                embeds: [{
                    title: `**${bot.config.emojis.reddit} Reddit**`,
                    description: `> Select the subreddit you'd like to view.`,
                    color: Colors.Blue
                }],
                components: mainComponents
            })
        } else if (interaction.customId === "exit") { collector.stop(); }
    });
    collector.on("end", async () => {
        try {
            await msg?.edit({
                embeds: [{
                    author: { name: message.user.tag, icon_url: message.user.displayAvatarURL() },
                    description: `${bot.config.emojis.alert} | Reddit command exited. I hope you enjoyed the reddit posts!`,
                    color: Colors.Blue
                }], components: []
            });
        } catch (err: any) { }
    });
}, {
    description: "View the lastest on reddit!",
    dirname: __dirname,
    aliases: [],
    usage: "",
    enabled: true,
    slash: true
});
