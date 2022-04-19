const Express = require("express");
const Discord = require("discord.js")

const Router = Express.Router();

const webhook = require("../../utils/voteWebhook").webhook;
const SparkV = require("../../utils/voteWebhook").getBot();
const database = require("../../database/handler")

const voteUrls = {
  ["botlabs"]: {
    url: "bots.discordlabs.org",
    voteUrl: "https://bots.discordlabs.org/bot/884525761694933073/vote",
    color: "#e1e85a"
  },
  ["topgg"]: {
    url: "top.gg",
    voteUrl: "https://top.gg/bot/884525761694933073/vote",
    color: "BLUE"
  }
};

async function handleVote(vote, domainName, domainLink, embedColor) {
  let vUser = SparkV.users.cache.get(vote.uid || vote.user || vote.userID) || await SparkV.users.fetch(vote.uid || vote.user || vote.userID);
  let user = await database.getUser(vote.uid || vote.user || vote.userID);

  if (!vUser) vUser = vote

  try {
    user.votes.voted = Date.now();
    user.votes.total = parseInt(user.votes.total) + 1;
    user.money.balance = parseInt(user.money.balance) += 25000;

    user.markModified("user.votes.voted");
    user.markModified("user.votes.total");
    user.markModified("money.balance");

    await user.save();
  } catch (err) { }

  const voteEmbed = new Discord.MessageEmbed()
    .setAuthor({
      name: vUser.tag || `<@${vUser.uid || vUser.user || vUser.userID}>`,
      iconURL: vUser.displayAvatarURL({
        dynamic: true
      }) || "https://cdn.discordapp.com/embed/avatars/1.png"
    })
    .setTitle("Thank you for voting!")
    .setDescription(`As a reward, you get \`25,000 coins\`. You can vote again <t:${~~((Date.now() / 1000) + 43200)}:R>.`)
    .setFooter({
      text: `You voted on ${domainName}!`,
      iconURL: SparkV.user.displayAvatarURL({ dynamic: true })
    })
    .setColor(embedColor)
    .setTimestamp();

  vUser.send({
    embeds: [voteEmbed]
  }).catch(() => { });
  
  let vLogs = SparkV.channels.cache.get("886065770008805407") || await SparkV.channels.fetch("886065770008805407");
  let embed = new Discord.MessageEmbed()
    .setAuthor({
      name: vUser.tag || `<@${vUser.uid || vUser.user ||  vUser.userID}>`,
      iconURL: vUser.displayAvatarURL({
        dynamic: true
      }) || "https://cdn.discordapp.com/embed/avatars/1.png"
    })
    .setDescription(`**${vUser || vUser.tag } has voted for SparkV!**\nYou can vote again <t:${~~((Date.now() / 1000) + 43200)}:R>.\nYou've voted for SparkV ${user?.votes.total || "0"} times.`)
    .setColor(embedColor)
    .setTimestamp()

  const voteButton = new Discord.MessageButton()
      .setLabel("Vote")
      .setEmoji("<:stats:947990408657518652>")
      .setStyle("LINK")
      .setURL(domainLink)
  
  await vLogs.send({
    embeds: [embed],
    components: [new Discord.MessageActionRow().addComponents(voteButton)]
  });
}

Router.post("/", (req, res) => {
  const data = req.body
  console.log(`New vote from ${data.uid} on ${data.listName}.`)

  const listData = voteUrls[data.list] || {}

  try {
    handleVote(req.body, listData.url, listData.voteUrl, listData.color)

    res.status(200).send({ status: 200, message: "Success!" });
  } catch (err) {
    console.error(err)

    res.status(500).send({ status: 500, message: `Internal Server Error. ${err}` });
  }
})

// Void Bots List
Router.post("/vbl", webhook(async vote => handleVote(vote, "voidbots.net", "https://voidbots.net/bot/884525761694933073/vote", "#8356d6")))

// Infinity Bot List
Router.post("/ibl", webhook(async vote => handleVote(vote, "infinitybotlist.com", "https://infinitybotlist.com/bots/884525761694933073/vote", "#8356d6")))

module.exports = Router;
