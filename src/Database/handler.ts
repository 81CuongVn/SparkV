import Discord from "discord.js";

import UserS from "./schemas/user";
import MemberS from "./schemas/member";
import GuildS from "./schemas/guild";

export default {
	async init(this: any, bot: any) { // Would that work?
		this.client = bot;
	},

	async getUser(UserID: any) {
		let data = await UserS.findOne({
			id: UserID,
		});

		if (data) {
			return data;
		} else {
			data = new UserS({
				id: UserID,
			});

			return data;
		}
	},

	async getMember(MemberID: any, GuildID: any) {
		let member = await MemberS.findOne({
			id: MemberID,
			guildID: GuildID,
		});

		if (member) {
			return member;
		} else {
			member = new MemberS({
				id: MemberID,
				guildID: GuildID,
			});

			return member;
		}
	},

	async getGuild(GuildID: any) {
		let guild = await GuildS.findOne({
			id: GuildID,
		});

		if (guild) {
			return guild;
		} else {
			guild = new GuildS({
				id: GuildID,
			});

			return guild;
		}
	},
};
