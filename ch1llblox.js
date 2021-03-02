// KingCh1ll //
// Last Edited: 2/25/2021 //
// Index.js //

/*
console.log("  _                     _ _             ")
console.log(" | |                   | (_)            ")
console.log(" | |     ___   __ _  __| |_ _ __   __ _ ")
console.log(" | |    / _ \\ / _` |/ _` | | '_ \\ / _` |")
console.log(" | |___| (_) | (_| | (_| | | | | | (_| |")
console.log(" |______\\___/ \\__,_|\\__,_|_|_| |_|\\__, |")
console.log("                                   __/ |")
console.log("                                  |___/")
*/

console.log("LOADING STARTED - BOT => Now loading bot.")

// Librarys //
const { Client, Collection } = require("discord.js")
const { readdir } = require("fs")
const AntiSpam = require("discord-anti-spam")

// Create Bot //
const Bot = new Client({
  disableEveryone: true,

  presence: {
    activity: {
      name: `Time to wake up!`,
      type: "PLAYING"
    },
    status: "DND"
  }
})

// Database //
require("./database/connector")(Bot)

// Modules //
const functions = require("./modules/functions")
const Distube = require("./modulehandlers/distubehandler")

/* if (!process.env.TestMode){
  const Noblox = require("./modulehandlers/noblox")
} */

// Get User Count //
Bot.UserCount = 0

// Collections //
Bot.Rules = new Collection()
Bot.categories = new Collection()
Bot.commands = new Collection()
Bot.aliases = new Collection()
Bot.events = new Collection()
Bot.cooldowns = new Collection()

Bot.AntiSpam = new AntiSpam({
  warnThreshold: 3, // Amount of messages sent in a row that will cause a warning.
	muteThreshold: 4, // Amount of messages sent in a row that will cause a mute
	kickThreshold: 7, // Amount of messages sent in a row that will cause a kick.
	banThreshold: 7, // Amount of messages sent in a row that will cause a ban.
	maxInterval: 5000, // Amount of time (in milliseconds) in which messages are considered spam.
	warnMessage: '{@user}, Please stop spamming.', // Message that will be sent in chat upon warning a user.
	kickMessage: '**{user_tag}** has been kicked for spamming.', // Message that will be sent in chat upon kicking a user.
	muteMessage: '**{user_tag}** has been muted for spamming.',// Message that will be sent in chat upon muting a user.
	banMessage: '**{user_tag}** has been banned for spamming.', // Message that will be sent in chat upon banning a user.
	maxDuplicatesWarning: 7, // Amount of duplicate messages that trigger a warning.
	maxDuplicatesKick: 10, // Amount of duplicate messages that trigger a warning.
	maxDuplicatesBan: 12, // Amount of duplicate messages that trigger a warning.
	exemptPermissions: ["ADMINISTRATOR", "MANAGE_MESSAGES"], // Bypass users with any of these permissions.
	ignoreBots: true, // Ignore bot messages.
	verbose: true, // Extended Logs from module.
	ignoredUsers: [], // Array of User IDs that get ignored.
	muteRoleName: "Muted", // Name of the role that will be given to muted users!
	removeMessages: true // If the bot should remove all the spam messages when taking action on a user!
})

// Error Handlers //
process.on("uncaughtException", err => {
  const ErrorMessage = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./")

  console.log(`ERROR => Uncaught Exception error. ${ErrorMessage}`)
  console.error(err)

  process.exit(1)
})

process.on("unhandledRejection", err => {
  console.log(`ERROR => Unhandled rejection error. ${err}`)
})

// Code //
console.log("---------- Loading Bot Functions ----------") 
functions(Bot)

console.log("---------- Loading DisTube ----------") 
Distube(Bot)

console.log("---------- Loading Events ----------")
readdir("./events", (err, files) => {
  if (err) {
    return Bot.Log("ERROR", "EVENT LOADING ERROR", err)
  }

  files.forEach(file => {
    let EventName = file.split(".")[0]
    let FileEvent = require(`./events/${EventName}`)

    if (!process.env.ConsoleLog){
      Bot.Log("SUCCESS", "EVENT LOADING", `Successfully loaded event ${EventName}!`)
    }

    Bot.on(EventName, (...args) => FileEvent.run(Bot, ...args))
  })
})

console.log("---------- Loading Commands ----------")
readdir("./commands", (err, cats) => {
  if (err) {
    return Bot.Log("ERROR", "COMMANDS LOADING ERROR", err)
  }

  cats.forEach(cat => {
    Bot.categories.set(cat, cat)

    readdir(`./commands/${cat}`, (err, files) => {
      files.forEach(file => {
        if (!file.endsWith(".js")) {
          return
        }

        let commandname = file.split(".")[0]
        let FileJs = require(`./commands/${cat}/${commandname}`)

        Bot.commands.set(commandname, FileJs)

        if (!process.env.ConsoleLog){
          Bot.Log("SUCCESS", "COMMAND LOADING", `Successfully loaded command ${commandname}!`)
        }
      })
    })
  })
})

/*
console.log("---------- Logging into Roblox ----------") 
if (!process.env.TestMode){
  Noblox(Bot)
}
*/

console.log("---------- Logging into Bot ----------") 
Bot.login(process.env.token)

Bot.Log("SUCCESS", "Bot Loading", "Bot loading complete!")