const Discord = require("discord.js");
const Canvas = require("discord-canvas");
const path = require("path");

const database = require("../../database/handler");

module.exports = {
	once: false,
	async execute(bot, oldMember, newMember) {
		const data = await database.getGuild(newMember.guild.id);

		if (data.plugins.welcome.enabled === "false") return;

		if (oldMember.pending === true && newMember.pending === false) {
			if ((data.plugins.welcome?.roles?.length || 0) > 0) {
				const roles = data.plugins.welcome.roles.map(r => newMember.guild.roles.cache.get(r));

				data.plugins.welcome.roles.forEach(async r => {
					if (await newMember.guild.roles.fetch(r)) {
						await newMember.roles.add(await newMember.guild.roles.fetch(r));
					}
				});
			}
		}
	},
};
