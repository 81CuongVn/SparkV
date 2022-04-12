const Discord = require("discord.js");
const { createCanvas, loadImage, registerFont } = require("canvas");
const fs = require("fs");
const path = require("path");

const Invitergx =
	/(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite|discord.com\/invite)\/+[a-zA-Z0-9]{6,16}/g;
const URLrgx = /(https?:\/\/)?(www\.)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/g;

let bot;

module.exports = {
	/**
   * Initilizes functions.
   * @param {Object} client Discord client.
   */
	init(client) {
		if (!client) {
			throw new TypeError("Discord client must be valid.");
		}

		bot = client;

		registerFont(`${process.env.MainDir}/assets/fonts/LuckiestGuy-Regular.ttf`, { family: "luckiest guy" });
		registerFont(`${process.env.MainDir}/assets/fonts/TheBoldFont.ttf`, { family: "Bold" });
	},

	/**
   *
   * @param {Object} message Message object.
   * @param {Object} data Guild's data souced from the guild data collection using mongoose.
   * @returns {string} Prefix.
   */
	getPrefix(message, data) {
		const acceptedPrefixes = [
			process.argv.includes("--dev") === true ? "_" : "sv!",
		];

		let prefix = null;

		acceptedPrefixes.forEach(p => {
			if (message.content.startsWith(p) || message.content.toLowerCase().startsWith(p)) {
				prefix = p;
			}
		});

		return prefix;
	},

	/**
	 * Split bar. A nice little progress bar.
	 * @param {number} current The current progress.
	 * @param {number} total The total progress.
	 * @param {number} size The size of the progress bar.
	 * @param {string} line The line of the progress bar. Default: ▬
	 * @param {string} slider The slider emoji. Default: 🔘
	 * @returns {string} The progress bar, as a string.
	 */
	splitBar(current, total, size = 40, line = "▬", slider = "🔘") {
		if (current > total) {
			return line.repeat(size + 2);
		} else {
			const percent = current / total;
			const progress = Math.round(size * percent);
			const progLeft = size - progress;

			return line.repeat(progress).replace(/.$/, slider) + line.repeat(progLeft);
		}
	},

	/**
	 * Create Card
	 * @param {Object} options Options.
	 * @returns {Promise<Canvas>} Canvas
	 */
	async createCard(options) {
		const canvas = createCanvas(1100, 500);
		const context = canvas.getContext("2d");

		// Background
		context.fillStyle = "#3461eb";
		context.fillRect(0, 0, canvas.width, canvas.height);
		const background = await loadImage(`${process.env.MainDir}/assets/images/background.png`);
		context.drawImage(background, 0, 0, canvas.width, canvas.height);

		context.fillStyle = "#fff719";
		context.fillRect(canvas.width - 30, 0, 30, canvas.height);
		context.fillRect(0, 0, 30, canvas.height);
		context.fillRect(30, canvas.height - 30, canvas.width - 50, 30);
		context.fillRect(30, 0, canvas.width - 50, 30);

		// Username
		context.fillStyle = "#5f9afa";
		context.globalAlpha = 0.4;
		context.fillRect(canvas.width - 680, canvas.height - 300, 600, 65);

		context.globalAlpha = 1;
		context.fillStyle = "#ffffff";
		context.font = "50px Bold",
		context.fillText(options.user.tag, canvas.width - 660, canvas.height - 248);

		// Server
		context.fillStyle = "#5f9afa";
		context.globalAlpha = 0.4;
		context.fillRect(canvas.width - 680, canvas.height - 200, 600, 65);

		context.globalAlpha = 1;
		context.fillStyle = "#ffffff";
		context.font = "35px Bold",
		context.fillText(options.text.desc, canvas.width - 660, canvas.height - 150);

		// Bottom Text
		context.font = "30px Bold";
		context.fillStyle = "#0ea7ed";
		context.fillText(options.text.footer, 50, canvas.height - 50);

		// Title Text
		context.font = "80px Bold";
		context.strokeStyle = "#000000";
		context.lineWidth = 16;
		context.strokeText(options.text.title, canvas.width - 620, canvas.height - 375);
		context.fillStyle = "#0ea7ed";
		context.fillText(options.text.title, canvas.width - 620, canvas.height - 375);

		// Avatar
		context.beginPath();
		context.lineWidth = 10;
		context.strokeStyle = "#fff";
		context.arc(215, (canvas.height / 2), 125, 0, Math.PI * 2, true);
		context.stroke();
		context.closePath();
		context.clip();

		const Avatar = await loadImage(options.user.displayAvatarURL({ format: "png" }));
		context.drawImage(Avatar, 90, 125, 250, 250);

		return canvas;
	},

	/**
   *
   * @param {number} Number The number to format.
   * @returns {string} The formatted number.
   */
	formatNumber(Number) {
		if (typeof Number === "string") {
			Number = parseInt(Number);
		}

		const DecPlaces = Math.pow(10, 1);
		const Abbrev = ["k", "m", "g", "t", "p", "e"];

		for (let i = Abbrev.length - 1; i >= 0; i--) {
			const Size = Math.pow(10, (i + 1) * 3);

			if (Size <= Number) {
				Number = Math.round((Number * DecPlaces) / Size) / DecPlaces;

				if (Number === 1000 && i < Abbrev.length - 1) {
					Number = 1;
					i++;
				}

				Number += Abbrev[i];
				break;
			}
		}

		return Number;
	},

	/**
   *
   * @param {number} ms The ms to convert to a time.
   * @param {string} type The type of formatted time. (long/short)
   * @returns {string} The time.
   */
	MSToTime(ms, type = "long") {
		const RoundNumber = ms > 0 ? Math.floor : Math.ceil;
		const Days = RoundNumber(ms / 86400000);
		const Hours = RoundNumber(ms / 3600000) % 24;
		const Mins = RoundNumber(ms / 60000) % 60;
		const Secs = RoundNumber(ms / 1000) % 60;

		let time;
		if (type === "long") {
			time = Days > 0 ? `${Days} Day${Days === 1 ? "" : "s"}, ` : "";
			time += Hours > 0 ? `${Hours} Hour${Hours === 1 ? "" : "s"}, ` : "";
			time += Mins > 0 ? `${Mins} Minute${Mins === 1 ? "" : "s"} & ` : "";
			time += Secs > 0 ? `${Secs} Second${Secs === 1 ? "" : "s"}.` : "0 Seconds.";
		} else if (type === "short") {
			time = Days > 0 ? `${Days}d ` : "";
			time += Hours > 0 ? `${Hours}h ` : "";
			time += Mins > 0 ? `${Mins}m ` : "";
			time += Secs > 0 ? `${Secs}s` : "0s";
		}

		return time;
	},

	/**
   *
   * @param {string} key The search quarry.
   * @returns {Object} User if found.
   */
	async fetchUser(key) {
		if (!key || typeof key !== "string") return;

		if (key.match(/^<@!?(\d+)>$/)) {
			const user = bot.users.fetch(key.match(/^<@!?(\d+)>$/)[1]).catch(() => { });

			if (user) return user;
		}

		if (key.match(/^!?(\w+)#(\d+)$/)) {
			const user = bot.users.cache.find(
				u => u.username === key.match(/^!?(\w+)#(\d+)$/)[0] && u.discriminator === key.match(/^!?(\w+)#(\d+)$/)[1],
			);

			if (user) return user;
		}

		return await bot.users.fetch(key).catch(() => { });
	},

	// Plugins //

	/**
   *
   * @param {string} String The String to check for a URL.
   * @returns {boolean}
   */
	isURL(String) {
		if (URLrgx.test(String)) {
			return true;
		}

		if (URLrgx.test(String)) {
			return true;
		}

		return false;
	},

	/**
   * Get's all of the bot's guilds and counts them up.
   * @returns {string} Server count
   */
	async GetServerCount() {
		if (bot.config.sharding.shardingEnabled === false) return bot.guilds.cache.size;

		const promises = [bot.shard.fetchClientValues("guilds.cache.size")];

		return Promise.all(promises).then(results => results.flat().reduce((acc, ServerCount) => acc + ServerCount, 0));
	},

	/**
   * Get's all of the bot's guilds and counts the user count.
   * @returns {string} User count
   */
	async GetUserCount() {
		if (bot.config.sharding.shardingEnabled === false) {
			let CollectedUsers = 0;

			bot.guilds.cache.map((server, id) => (CollectedUsers = server.memberCount + CollectedUsers));

			return CollectedUsers;
		}
	},

	/*
  Async Debounce(callback, wait, immediate) {
	let timeout

	return function() {
	  let context = this,
		args = args
	  let later = function() {
		timeout = null
		if (!immediate) callback.apply(context, args)
	  }
	  let callNow = immediate && !timeout
	  clearTimeout(timeout)
	  timeout = setTimeout(later, wait)
	  if (callNow) callback.apply(context, args)
	},
  },
  */

	/**
   *
   * @param {string} ms The amount of ms to wait for.
   * @returns {promise} Sets timeout.
   */
	async wait(ms) {
		return new Promise(r => setTimeout(r, ms));
	},

	/**
   *
   * @param {Date} date The date.
   * @returns {string} Formatted date.
   */
	async FormatDate(date) {
		return new Intl.DateTimeFormat("en-US").format(date);
	},
};
