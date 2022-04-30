/* eslint-disable no-return-assign */
const { Message, MessageEmbed, Interaction } = require("discord.js");
const translate = require("@vitalets/google-translate-api");

async function translateContent(content) {
	if (!this?.guild?.data?.language) return content;

	// Native languge
	if (this.guild.data.language === "en") return content;

	let content1, content2;

	if (content.includes(" | ")) {
		content1 = content.split(" | ")[0];
		content2 = content.split(" | ")[1];
	}

	const cache = await this.client.redis.get(`${content2 || content}-${this.guild.data.language}`);
	let translation;

	if (cache) {
		translation = cache;

		return translation;
	} else {
		try {
			await translate(content2 || content, {
				from: "en",
				to: this.guild.data.language
			}).then(res => {
				if (content.includes(" | ")) {
					translation = `${content1} | ${res.text}`;
				} else {
					translation = res.text;
				}
			}).catch(err => bot.logger(err, "error"));

			try {
				await this.client.redis.set(`${content2 || content}-${this.guild.data.language}`, translation);
			} catch (err) { }

			return translation;
		} catch (err) {
			return content;
		}
	}
}

async function replyTranslate(options) {
	if (typeof options === "string") {
		const newOptions = {
			content: options,
			fetchReply: true,
			allowedMentions: {
				repliedUser: false
			},
		};

		options = newOptions;
	}

	let data = {
		fetchReply: true,
		allowedMentions: {
			repliedUser: false
		}
	};

	data = Object.assign(data, options);

	if (options.content) {
		const translation = await translateContent(options.content);

		data.content = translation;
	}

	if (this?.applicationId) {
		return this.followUp(data);
	} else {
		return this.reply(data);
	}
}

async function editTranslate(options) {
	if (typeof options === "string") {
		const newOptions = {
			content: options,
			fetchReply: true,
			allowedMentions: {
				repliedUser: false
			},
		};

		options = newOptions;
	}

	let data = {
		fetchReply: true,
		allowedMentions: {
			repliedUser: false
		}
	};

	data = Object.assign(data, options);

	if (options.content) {
		const translation = await translateContent(options.content);

		data.content = translation;
	}

	if (this?.applicationId) {
		return this.editReply(data);
	} else {
		return this.edit(data);
	}
}

Interaction.prototype.replyT = replyTranslate;
Interaction.prototype.editT = editTranslate;
Interaction.prototype.translate = translateContent;

Message.prototype.replyT = replyTranslate;
Message.prototype.editT = editTranslate;
Message.prototype.translate = translateContent;
