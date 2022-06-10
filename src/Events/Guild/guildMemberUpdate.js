const Discord = require("discord.js");
const path = require("path");

const database = require("@database/handler");

module.exports = {
	once: false,
	async execute(bot, oldMember, newMember) {
		const data = await database.getGuild(newMember.guild.id);

		if (data.welcome.enabled === "false") return;

		if (oldMember.pending === true && newMember.pending === false) {
			if ((data.welcome?.roles?.length || 0) > 0) {
				data.welcome?.roles?.forEach(async r => {
					if (await newMember.guild.roles.fetch(r)) {
						await newMember.roles.add(await newMember.guild.roles.fetch(r));
					}
				});
			}
		}
	}
};
