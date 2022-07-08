import Discord from "discord.js";

import UserS from "./schemas/user";
import MemberS from "./schemas/member";
import GuildS from "./schemas/guild";

async function getUser(id: string | number) {
	const data = await UserS.findOne({ id });
	if (data) return data;

	return new UserS({ id });
}

async function getMember(id: string | number, guildID: string | number) {
	const member = await MemberS.findOne({ id, guildID });
	if (member) return member;

	return new MemberS({ id, guildID });
}

async function getGuild(id: string | number) {
	const guild = await GuildS.findOne({ id });
	if (guild) return guild;

	return new GuildS({ id });
}

export default { getUser, getMember, getGuild };
export { getUser, getMember, getGuild };
