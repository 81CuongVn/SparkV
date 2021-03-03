const Discord = require("discord.js");
const request = require("node-fetch");

exports.run = async (Bot, message) => {
  request("https://dog.ceo/api/breeds/image/random")
    .then(res => res.json())
    .then(async json => {
      if (!json.status === "success") {
        return await message.channel.send({
          embed: {
            title: `Uh Oh ${message.author.username}!`,
            description: `Looks like the website returned an error! Please try again later.`,
            color: "#0099ff",
            
            footer: {
              text: "Maybe up vote our bot while you wait?",
              icon_url: Bot.user.displayAvatarURL()
            },
          }
        })
      }

      const MemeMessage = await message.channel.send({
        embed: {
          title: "Bark Bark!",
          description: "Aweeeeee :D",
          color: "#0099ff",
          url: json.message,
          
          image: { 
            url: json.message
          },
          
          footer: {
            text: `Powered by https://dog.ceo/dog-api/documentation/`,
            image: process.env.bot_logo
          },
        }
      });

      MemeMessage.react("😍");
    });
},

exports.config = {
  enabled: true,
  guild_only: true,
  aliases: ["cutedog"],
  bot_permissions: ["SEND_MESSAGES", "EMBED_LINKS", "VIEW_CHANNEL"]
},
  
exports.help = {
  name: "Dog",
  description: "I will send a cute dog! Aweeeee :D",
  usage: "",
  category: "🐶animals🐶",
  cooldown: 2
}