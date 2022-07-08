/* eslint-disable no-return-assign */
import { Message, BaseInteraction } from "discord.js";
import translate from "@vitalets/google-translate-api";

async function translateContent(this: any, content: any) {
	if (!this?.guild?.data?.language) return content;
	if (this.guild.data.language === "en") return content;

	let content1: string, content2: any;
	if (content?.includes(" | ")) {
		content1 = content?.split(" | ")[0];
		content2 = content?.split(" | ")[1];
	}

	const cache = await this.client.redis.get(`${content2 || content}-${this.guild.data.language}`);
	let translation;

	if (cache) {
		translation = cache;
		return translation;
	} else {
		try {
			await translate((content2 || content), {
				from: "en",
				to: this.guild.data.language
			}).then(res => {
				if (content.includes(" | ")) {
					translation = `${content1} | ${res.text}`;
				} else {
					translation = res.text;
				}
			}).catch((err: any) => this.client.logger(err, "error"));

			try {
				await this.client.redis.set(`${content2 || content}-${this.guild.data.language}`, translation);
			} catch (err: any) { }

			return translation;
		} catch (err: any) {
			return content;
		}
	}
}

async function replyTranslate(this: any, options: any) {
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

	let data: any = {
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

	if (this?.applicationId) return this.followUp(data);
	else return this.reply(data);
}

async function editTranslate(this: any, options: any) {
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

	let data: any = {
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

	if (this?.applicationId) return this.editReply(data);
	else return this.edit(data);
}

(BaseInteraction as any).prototype.replyT = replyTranslate;
(BaseInteraction as any).prototype.editT = editTranslate;
(BaseInteraction as any).prototype.translate = translateContent;

(Message as any).prototype.replyT = replyTranslate;
(Message as any).prototype.editT = editTranslate;
(Message as any).prototype.translate = translateContent;
