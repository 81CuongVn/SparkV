const Discord = require("discord.js");
const request = require("node-superfetch")
const path = require("path")
const Canvas = require("canvas")

const WrapText = async (ctx, text, maxWidth) => {
  return new Promise(resolve => {
    if (ctx.measureText(text).width < maxWidth){
      return resolve([text]);
    }

    if (ctx.measureText('W').width > maxWidth){
      return resolve(null);
    }

    const words = text.split(' ');
    const lines = [];
    let line = '';
    while (words.length > 0) {
      let split = false;
      while (ctx.measureText(words[0]).width >= maxWidth) {
        const temp = words[0];
        words[0] = temp.slice(0, -1);
        if (split) {
          words[1] = `${temp.slice(-1)}${words[1]}`;
        } else {
          split = true;
          words.splice(1, 0, temp.slice(-1));
        }
      }

      if (ctx.measureText(`${line}${words[0]}`).width < maxWidth) {
        line += `${words.shift()} `;
      } else {
        lines.push(line.trim());
        line = '';
      }
      if (words.length === 0) lines.push(line.trim());
    }

    return resolve(lines);
  });
}

const GenerateClueCard = async (Question) => {
  const canva = Canvas.createCanvas(1280, 720)
  const ctx = canva.getContext("2d")

  ctx.fillStyle = "#4169e1"
  ctx.fillRect(0, 0, canva.width, canva.height)
  ctx.textAlign = "center"
  ctx.textBaseline = "top"
  ctx.fillStyle = "top"
  ctx.fillStyle = "white"
  ctx.font = "900px"

  const Lines = WrapText(ctx, Question.toUpperCase(), 813)
  const TopMost = (canva.height / 2) - (((Lines.length * 52) /2) + ((20 * (Lines.length - 1)) / 2))

  for (let i = 0; i < Lines.length; i++){
    const Height = TopMost + ((52 + 20) * i)

    ctx.fillStyle = "black"
    ctx.fillText(Lines[i], (canva.width / 2) + 6, Height + 6)
    ctx.fillStyle = "white"
    ctx.fillText(Lines[i], canva.width / 2, Height)
  }

  return canva.toBuffer()
}

exports.run = async (Bot, message, Arguments) => {
  const Channel = message.member.voice.channel

  const Body = await request
    .get("https://jservice.io/api/random")
    .query({ count: 1 })

  const Question = await Body[0]
  const ClueCard = await GenerateClueCard(Question.question.replace(/<\/?i>/gi, ""))
  var Connection

  try {
    if (Channel){
      Connection = message.guild ? await Channel.join : null

      if (Connection){
        Connection.play(path.join(__dirname, "..", "..", "assets", "sounds", "thinking.mp3"))

        await message.react("🔊")
      }
    }
  } catch(err){
    return message.channel.send("Uh oh! Something went wrong. Please try again later or leave the VC.")
  }

  const Category = new Discord.MessageEmbed()
    .setTitle(Question.category.title.toUpperCase())
    .setDescription(`The category is ${Question.category.title.toUpperCase()}!`)
    .setFooter("You have 120 seconds to anwser.")
    .setImage(ClueCard)
    .setColor(Bot.Config.Embed.EmbedColor)

  await message.channel.send(Category)

  const Messages = await message.channel.awaitMessages(response => response.author.id === message.author.id, {
    max: 1,
    time: 120 * 1000
  })

  if (Connection){
    Connection.dispatcher.end()
    Channel.leave()
  }

  const Answer = Question.answer.replace(/<\/?i>/gi, "*")

  if (!Messages.size){
    return message.channel.send(`**Times up! the answer was ${Answer}.**`)
  }

  const Won = Messages
    .first().content
    .toLowerCase() === Answer.toLocaleLowerCase()

  if (Won){
    return message.channel.send("🎉 Correct!")
  } else {
    return message.channel.send(`❌ Wrong! The answer was ${Answer}.`)
  }
},

  exports.config = {
    name: "Trivia",
    description: "Play a game of trivia! For the maximum amount of enjoyment, join a VC with your friends.",
    aliases: ["questions"],
    usage: "",
    category: "🎲games🎲",
    bot_permissions: ["SEND_MESSAGES", "READ_MESSAGE_HISTORY", "EMBED_LINKS", "VIEW_CHANNEL"],
    member_permissions: [],
    enabled: true,
    cooldown: 60
  }