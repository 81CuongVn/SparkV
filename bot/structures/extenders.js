/* eslint-disable no-return-assign */
const { Message, MessageEmbed, Interaction } = require("discord.js");
const translate = require("@vitalets/google-translate-api");

async function translateContent(content) {
	if (!this?.guild?.data?.language) return content;

	// Native languge
	if (this.guild.data.language === "en") return content;

	const cache = await this.client.redis.get(`${content}-${this.guild.data.language}`).then(res => JSON.parse(res));
	let translation;

	if (cache) { translation = cache; } else {
		let content1, content2;

		if (content.includes(" | ")) {
			content1 = content.split(" | ")[0];
			content2 = content.split(" | ")[1];
		}

		await translate(content2, {
			to: this.guild.data.language
		}).then(res => content.includes(" | ") ? translation = `${content1} | ${res.text}` : translation = res.text).catch(err => bot.logger(err, "error"));

		await this.client.redis.set(`${content}-${this.guild.data.language}`, JSON.stringify(translation));
	}

	return await translation;
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

	if (options.content) {
		const translation = await translateContent(options.content);
		const data = {
			content: translation,
			fetchReply: true,
			allowedMentions: {
				repliedUser: false
			},
		};

		if (this?.applicationId) {
			return this.followUp(data);
		} else {
			return this.reply(data);
		}
	} else {
		const data = {
			fetchReply: true,
			allowedMentions: {
				repliedUser: false
			},
		};

		const correctData = Object.assign(data, options);

		if (this?.applicationId) {
			return this.followUp(correctData);
		} else {
			return this.reply(correctData);
		}
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

	if (options.content) {
		const translation = await translateContent(options.content);
		const data = {
			content: translation,
			fetchReply: true,
			allowedMentions: {
				repliedUser: false
			},
		};

		if (this?.applicationId) {
			return this.editReply(data);
		} else {
			return this.edit(data);
		}
	} else {
		const data = {
			fetchReply: true,
			allowedMentions: {
				repliedUser: false
			},
		};

		const correctData = Object.assign(data, options);

		if (this?.applicationId) {
			return this.editReply(correctData);
		} else {
			return this.edit(correctData);
		}
	}
}

async function replySuccess(options) {
	console.log(this.user);
	const Embed = new MessageEmbed()
		.setAuthor({
			name: (this.user ? this.user : this.author).tag,
			iconURL: (this.user ? this.user : this.author).displayAvatarURL({ dynamic: true })
		})
		.setFooter({
			text: this.client.config.embed.footer,
			iconURL: this.client.user.displayAvatarURL({ dynamic: true })
		})
		.setImage(options.image)
		.setColor("GREEN");

	if (options?.title) Embed.setTitle(options.title);
	if (options?.description) Embed.setDescription(options.description);
	if (options?.image) Embed.setImage(options.image);
	if (options?.thumbnail) Embed.setThumbnail(options.thumbnail);
	if (options?.footer) {
		Embed.setFooter({
			text: options.footer,
			iconURL: this.client.user.displayAvatarURL({ dynamic: true }),
		});
	}

	if (this?.applicationId) {
		return this.followUp({
			embeds: [Embed],
		});
	} else {
		return this.reply({
			embeds: [Embed],
		});
	}
}

async function replyError(options) {
	const Embed = new MessageEmbed()
		.setAuthor({
			name: (this.user ? this.user : this.author).tag,
			iconURL: (this.user ? this.user : this.author).displayAvatarURL({ dynamic: true })
		})
		.setFooter(bot.config.embed.footer)
		.setColor("RED");

	if (options?.title) Embed.setTitle(options.title);
	if (options?.description) Embed.setDescription(options.description);
	if (options?.fields) Embed.setFields(options.fields);
	if (options?.footer) Embed.setFooter(options.footer);

	return await replyTranslate({
		embeds: [Embed],
	});
}


Interaction.prototype.replyT = replyTranslate;
Interaction.prototype.editT = editTranslate;
Interaction.prototype.translate = translateContent;

Message.prototype.replyT = replyTranslate;
Message.prototype.editT = editTranslate;
Message.prototype.translate = translateContent;

Interaction.prototype.replySuccess = replySuccess;
Interaction.prototype.replyError = replyError;

Message.prototype.replySuccess = replySuccess;
Message.prototype.replySuccess = replyError;
