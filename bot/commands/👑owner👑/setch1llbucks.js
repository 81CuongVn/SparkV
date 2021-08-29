const Discord = require(`discord.js`);

exports.run = async (bot, message, args, command, data) => {
    if (message.author.id !== process.env.OWNERID) {
        return message.reply(`${bot.config.bot.Emojis.error} | Access denied.`);
    }

    const User = await bot.GetMember(message, args);

    if (!User) {
        return message.reply;
    }

    data.user.money.balance = args[1];
    await data.user.save();

    message.reply(`${bot.config.bot.Emojis.success} | Success!`);
};
exports.config = {
<<<<<<< HEAD
  name: `SetCh1llBucks`,
  description: `Set someone's Ch1llBucks!`,
  aliases: [],
  usage: `<user> <ammount>`,
  category: `👑Owner👑`,
  bot_permissions: [`SEND_MESSAGES`, `EMBED_LINKS`, `VIEW_CHANNEL`],
  member_permissions: [],
  enabled: true,
  cooldown: 15,
=======
    name: `SetCh1llBucks`,
    description: `Set someone's Ch1llBucks!`,
    aliases: [],
    usage: `<user> <ammount>`,
    category: `👑Owner👑`,
    bot_permissions: [`SEND_MESSAGES`, `EMBED_LINKS`, `VIEW_CHANNEL`],
    member_permissions: [],
    enabled: true,
    cooldown: 15,
>>>>>>> 70609d4f007e7ef8d0bb40ceac5f221f0697eb89
};
