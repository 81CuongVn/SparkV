const Discord = require(`discord.js`);

(exports.run = async (bot, message, args, command, data) => {
    if (!message.member.voice.channel) {
        return message
            .reply(
                `${bot.config.bot.Emojis.error} | You must be in a __**voice channel**__ to use this command!`
            )
            .then(m => m.delete({ timeout: 5000 }));
    }

    let queue = await bot.distube.getQueue(message);

    if (queue) {
        bot.distube.skip(message);

        message.reply({
            embed: {
                title: `${bot.config.bot.Emojis.music} | Skipped Song`,
                description: `Skipped currently playing song.`,
                color: `#0099ff`,

                fields: [
                    {
                        name: `Skipped To`,
                        value: queue.songs[0],
                        inline: true,
                    },
                ],

                thumbnail: {
                    url: `https://www.notebookcheck.net/fileadmin/Notebooks/News/_nc3/YouTube.jpg`,
                },

                footer: {
                    text: `Skipped song`,
                    icon_url: bot.user.displayAvatarURL(),
                },
            },
        });
    }
}),
    (exports.config = {
        name: `Skip`,
        description: `Skip to the next song in the queue.`,
        aliases: [],
        usage: ``,
        category: `🎵Music🎵`,
        bot_permissions: [
            `SEND_MESSAGES`,
            `READ_MESSAGE_HISTORY`,
            `EMBED_LINKS`,
            `VIEW_CHANNEL`,
            `CONNECT`,
            `SPEAK`,
        ],
        member_permissions: [],
        enabled: true,
        cooldown: 5,
    });
