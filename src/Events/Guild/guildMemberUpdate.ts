import Discord, { Role } from "discord.js";
import path from "path";

import database from "../../Database/handler";

export default {
	once: false,
	async execute(bot: any, oldMember: any, newMember: any) {
		const data = await database.getGuild(newMember.guild.id);

		if (data.welcome.enabled === "false") return;

		if (oldMember.pending === true && newMember.pending === false) {
			if ((data.welcome?.roles?.length || 0) > 0) {
				data.welcome?.roles?.forEach((r: any) => newMember.roles.add(r.id).catch(() => {}));
			}
		}
	}
};
