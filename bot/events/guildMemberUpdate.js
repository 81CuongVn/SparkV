const Discord = require("discord.js");
const Canvas = require("discord-canvas");
const path = require("path");

const database = require("../../database/handler");

module.exports = {
	once: false,
	async execute(bot, oldMember, newMember) {
		const data = await database.getGuild(member.guild.id);

		if (data.plugins.welcome.enabled === "false") return;

		console.log(oldMember.pending);
		console.log(newMember.pending);
		console.log(oldMember.pending === true && newMember.pending === false);
		if (oldMember.pending === true && newMember.pending === false) {
			if ((data.plugins.welcome?.roles?.length || 0) > 0) {
				const roles = data.plugins.welcome.roles.map(r => member.guild.roles.cache.get(r));

				data.plugins.welcome.roles.forEach(async r => {
					if (await member.guild.roles.fetch(r)) {
						await member.roles.add(await member.guild.roles.fetch(r));
					}
				});
			}
		}
	},
};
