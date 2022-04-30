const Discord = require("discord.js");
const logger = require("@modules/logger");

exports.run = async error => await logger(`Unhandled rejection error. ${error}.`, "error");
