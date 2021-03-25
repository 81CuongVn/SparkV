const Discord = require("discord.js");

exports.run = async (Bot, message, Arguments) => {
  const Opponent = message.mentions.members.first() || message.guild.members.cache.get(Arguments[0])

  if (!Arguments) {
    return message.channel.send("This command doesn't support API yet. Please mention someone to challenge.")
  }

  if (Opponent.user.bot) {
    return message.channel.send("That user is a bot lol.")
  }

  if (Opponent.user.id === message.author.id) {
    return message.channel.send("You cannot play against yourself lol.")
  }

  const VerificationEmbed = new Discord.MessageEmbed()
    .setTitle("⚔ BlackJack Duel")
    .setDescription(`${Opponent}, ${message.author} challenged you to a duel! React to this message to accpet or decline.`)
    .setFooter("Canceling in 60 seconds.")
    .setColor(Bot.Config.Embed.EmbedColor)

  const VerificationMessage = await message.channel.send(VerificationEmbed)
  const Emoji = await Bot.PromptMessage(VerificationMessage, Opponent.user, ["👍", "👎"], 250)

  if (Emoji === "👎") {
    await VerificationMessage.delete()

    return message.channel.send(`${Opponent} doesn't want to play. What a noob!`)
  } else if (Emoji === "👍") {
    await VerificationMessage.delete()

    const Board = GenerateBoard()
    const ColLevels = [5, 5, 5, 5, 5, 5, 5]

    var UserTurn = true
    var Winner = null
    var LastTurnDebounce = false

    const GameMessage = await message.channel.send(DisplayBoard(Board))

    while (!Winner && Board.some(row => row.includes(null))) {
      const User = UserTurn ? message.author : Opponent
      const Sign = UserTurn ? "user" : "opponent"

      await GameMessage.edit(`${DisplayBoard(Board)}\n${User}, which column do you pick? Type end to forfeit.`)

      const Filter = async (response) => {
        if (response.author.id !== User.id) {
          return false
        }

        const Choice = response.content

        if (Choice.toLowerCase() === "end") {
          await response.delete()

          return true
        }

        const spot = parseInt(Choice, 10) - 1
        await response.delete()
        return Board[ColLevels[spot]] && Board[ColLevels[spot]][spot] !== undefined
      }
      const Turn = await message.channel.awaitMessages(Filter, {
        max: 1,
        time: 350 * 1000
      })

      if (!Turn.size) {
        if (LastTurnDebounce) {
          Winner = "time"
          break
        } else {
          LastTurnDebounce = true
          UserTurn = !UserTurn
          continue
        }
      }

      const Choice = Turn.first().content

      if (Choice.toLowerCase() === "end") {
        Winner = UserTurn ? Opponent : message.author

        GameMessage.edit(`🎉 ${User} forfitted. ${Winner} won!`)
      }

      const Spot = parseInt(Choice, 10) - 1
      Board[ColLevels[Spot]][Spot] = Sign
      ColLevels[Spot] -= 1

      if (Winner === "time"){
        return GameMessage.edit(`${DisplayBoard(Board)}\n❔ Game expired due to inactivity.`)
      }

      if (HasWon(Board)) {
        Winner = UserTurn ? message.author : Opponent
      }

      if (LastTurnDebounce) {
        LastTurnDebounce = false
      }

      UserTurn = !UserTurn
    }

    GameMessage.edit(Winner ? `${DisplayBoard(Board)}\n🎉 Congrats, ${Winner}. You won!` : `⚔ ${DisplayBoard(Board)}\nIt's a draw!`)
  }
},

  exports.config = {
    name: "BlackJack",
    description: "Play a game of BlackJack with someone!",
    aliases: ["cf"],
    usage: "<optional user>",
    category: "🎲games🎲",
    bot_permissions: ["SEND_MESSAGES", "READ_MESSAGE_HISTORY", "EMBED_LINKS", "VIEW_CHANNEL"],
    member_permissions: [],
    enabled: true,
    cooldown: 60
  }