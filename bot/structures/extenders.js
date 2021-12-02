/* eslint-disable no-return-assign */
const { Message, Interaction } = require("discord.js");
const translate = require("@vitalets/google-translate-api");

Interaction.prototype.translate = translateContent;
Message.prototype.translate = translateContent;

Interaction.prototype.replyT = replyTranslate;
Message.prototype.replyT = replyTranslate;

async function translateContent(content) {
	if (!this?.guild?.data?.language) return content;

	// Native languge
	if (this.guild.data.language === "en") return content;

	const cache = await this.client.redis.getAsync(`${content}-${this.guild.data.language}`).then(res => JSON.parse(res));
	let translation;

	if (cache) { translation = cache; } else {
		let content1, content2;

		if (content.includes(" | ")) {
			content1 = content.split(" | ")[0];
			content2 = content.split(" | ")[1];
		}

		await translate(content2, {
			to: this.guild.data.language
		}).then(res => content.includes(" | ") ? translation = `${content1} | ${res.text}` : translation = res.text).catch(err => console.error(err));

		this.client.redis.setAsync(`${content}-${this.guild.data.language}`, JSON.stringify(translation), "EX", 15 * 60);
	}

	return await translation;
}

async function replyTranslate(options) {
	if (typeof options === "string") {
		const newOptions = {
			content: options,
			allowedMentions: {
				repliedUser: false
			}
		};

		options = newOptions;
	}

	if (options.content) {
		const translation = await translateContent(options.content);

		this.reply({
			content: translation,
			allowedMentions: {
				repliedUser: false
			}
		});
	} else { this.reply(options); }
}
