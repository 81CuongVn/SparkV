import discord from "discord.js";
import axios from "axios";

import cmd from "../../.././structures/command";

const subreddits = [
    {
        name: "meme",
        choices: [
            {
                name: "dankmeme",
                value: "/r/dankmemes/top/.json?sort=top&t=week"
            },
            {
                name: "memeeconomy",
                value: "https://www.reddit.com/r/MemeEconomy/top/.json?sort=top&t=week"
            },
            {
                name: "prequelmemes",
                value: "/r/PrequelMemes/top/.json?sort=top&t=day"
            },
            {
                name: "me_irl",
                value: "/r/me_irl/top/.json?sort=top&t=day"
            },
            {
                name: "gocommitdie",
                value: "/r/gocommitdie/top/.json?sort=top&t=week"
            },
            {
                name: "comedycemetery",
                value: "/r/ComedyCemetery/top/.json?sort=top&t=week"
            },
            {
                name: "animalsadvice",
                value: "/r/AdviceAnimals/top/.json?sort=top&t=week"
            },
            {
                name: "monke",
                value: "/r/Monke/top/.json?sort=top&t=week"
            }
        ]
    }
]

export default new cmd(async (bot: any, message: any, args: string[], command: any, data: any) => {
    const type = data.options.getString("type");
    const subreddit = subreddits.find(sub => sub.name === type);
    console.log(type, subreddit);

    /* -------------------------------------------------- SEND MESSAGE --------------------------------------------------*/
    const msg = await message.replyT({
        embeds: [{
            title: `**${bot.config.emojis.reddit} Reddit**`,
            description: `> Select the subreddit you'd like to view.`,
            color: bot.config.embed.color
        }],
        components: [{
            type: 1,
            components: subreddit.choices.map(choice => {
                return { type: 2, label: choice.name, customId: choice.value, style: "SECONDARY" }
            })
        }],
        fetchReply: true
    });

    /* -------------------------------------------------- HANDLE BUTTONS --------------------------------------------------*/
    const collector = msg.createMessageComponentCollector({ time: 300 * 1000 });
    collector.on("collect", async (interaction: any) => {
        if (!interaction.deferred) interaction.deferUpdate().catch((): any => { });

		let res;
        
        const cache = await bot.redis.get(interaction.customId).then((res: any) => JSON.parse(res));
        if (cache) {
            res = cache;
        } else {
            res = await axios.get(`https://www.reddit.com${interaction.customId}`).then((res: any) => res.data).catch((): any => { });
            await bot.redis.set(interaction.customId, JSON.stringify(res), { EX: 15 * 60 });
        }

        if (!res) return;

        const posts = res.data.children // .filter(filters[this.settings.type as keyof typeof filters]);
        let selectedPost = posts[Math.floor(Math.random() * Object.keys(posts).length)];
        if (selectedPost) selectedPost = selectedPost.data;
        else return;

        await message.replyT({
            embeds: [{
                title: selectedPost.title.length > 256 ? `${selectedPost.title.slice(0, 248)}...` : selectedPost.title,
                url: `https://www.reddit.com${selectedPost.permalink}`,
                image: { url: selectedPost.url },
                footer: {
                    text: `👍${selectedPost.ups} | 💬${selectedPost.num_comments} | 😃u/${selectedPost.author} | ⚙️r/${selectedPost.subreddit}`,
                    iconURL: bot.user.displayAvatarURL()
                },
                color: bot.config.embed.color
            }]
        });
    });
    collector.on("end", async () => {
        try { await msg?.edit({ components: [] }); } catch (err: any) { }
    });
}, {
    description: "View the lastest on reddit!",
    dirname: __dirname,
    aliases: [],
    usage: "",
    enabled: true,
    slash: true,
    options: [
        {
            type: 3,
            name: "type",
            description: "The type of subreddit to view.",
            required: true,
            choices: [
                {
                    name: "animal",
                    value: "animal"
                },
                {
                    name: "comic",
                    value: "comic"
                },
                {
                    name: "discord",
                    value: "discord"
                },
                {
                    name: "doseofinternet",
                    value: "doseofinternet"
                },
                {
                    name: "food",
                    value: "food"
                },
                {
                    name: "meme",
                    value: "meme"
                },
                {
                    name: "showerthought",
                    value: "showerthought"
                }
            ]
        }
    ]
});
