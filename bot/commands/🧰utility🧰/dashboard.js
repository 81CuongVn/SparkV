const Discord = require(`discord.js`);

(exports.run = async (bot, message) => {
<<<<<<< HEAD
  message.reply(
    `${bot.config.bot.Emojis.success} | Click the following link to view my dashboard! Link: https://ch1llblox.ch1ll.dev/dashboard`,
  );
}),
  (exports.config = {
    name: `Dashboard`,
    description: `I'll send my dashboard!`,
    aliases: [`dash`],
    usage: ``,
    category: `🧰Utility🧰`,
    bot_permissions: [`SEND_MESSAGES`, `EMBED_LINKS`, `VIEW_CHANNEL`],
    member_permissions: [],
    enabled: true,
    cooldown: 1.5,
  });
=======
    message.reply(
        `${bot.config.bot.Emojis.success} | Click the following link to view my dashboard! Link: https://ch1llblox.ch1ll.dev/dashboard`
    );
}),
    (exports.config = {
        name: `Dashboard`,
        description: `I'll send my dashboard!`,
        aliases: [`dash`],
        usage: ``,
        category: `🧰Utility🧰`,
        bot_permissions: [`SEND_MESSAGES`, `EMBED_LINKS`, `VIEW_CHANNEL`],
        member_permissions: [],
        enabled: true,
        cooldown: 1.5,
    });
>>>>>>> 70609d4f007e7ef8d0bb40ceac5f221f0697eb89
