const Discord = require("discord.js");

const cmd = require("../../templates/command");

const statuses = {
	online: "<:online:948002054029340733>",
	idle: "<:idle:948003685118664784>",
	dnd: "<:dnd:948003123308396624>",
	offline: "<:offline:948002054247432202>"
};

const badges = {
	HOUSE_BRAVERY: "<:house_bravery:941439956528803860>",
	HOUSE_BRILLIANCE: "<:house_brilliance:941439956507840543>",
	HOUSE_BALANCE: "<:house_balance:941440238486691921>",
	DISCORD_CERTIFIED_MODERATOR: "<:moderator:943240444777730068>",
};

function capFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = new cmd(
	async (bot, message, args, command, data) => {
		let user = message?.applicationId ? data.options.getMember("user") || message.user : (await bot.functions.fetchUser(args[0]) || message.author);
		const member = message.channel.guild.members.cache.get(user.id);

		const userdata = await bot.database.getUser(user.id);

		user = user.user ? await user.user.fetch() : await user.fetch();

		let num = 0;
		let addedRoles = 0;
		let roleCount = 0;
		let plusRoles = false;
		let roleColor;
		let roles = member.roles.cache
			.sort((a, b) => b.comparePositionTo(a))
			.filter(r => r.id !== message.guild.id)
			.map((r, id) => {
				roleCount++;
				if (num === 0) roleColor = r.hexColor;

				if (num < 4) {
					num++;

					return `<@&${r.id}>`;
				} else {
					plusRoles = true;
					addedRoles++;
				}
			})
			.join(" ");

		if (plusRoles === true) roles += `+${addedRoles}`;

		const members = message.guild.members.cache
			.sort((a, b) => a.joinedTimestamp - b.joinedTimestamp)
			.toJSON();

		const position = new Promise(forfill => {
			for (let i = 1; i < members.length + 1; i++) {
				if (members[i - 1].id === member.id) forfill(i);
			}
		});

		const InfoEmbed = new Discord.MessageEmbed()
			.setAuthor({
				name: `${user.user ? user.user.tag : user.tag} (${(user.user ? user.user.bot : user.bot) ? "Robot" : "Human"})`,
				iconURL: (user.user ? user.user : user).displayAvatarURL({ dynamic: true }),
			})
			.setThumbnail((user.user ? user.user : user).displayAvatarURL({ dynamic: true }))
			.addField(`${statuses[member?.presence?.status || "offline"]} Presence`, `\`\`\`${member?.presence?.status === "dnd" ? "Do Not Disturb" : capFirstLetter(member?.presence?.status)}\`\`\``, true)
			.addField(`${bot.config.emojis.clock} Join Position`, `\`\`\`${await position || "UNKNOWN"}/${members.length}\`\`\``, true)
			.addField(`${bot.config.emojis.id} User ID`, `\`\`\`${user.user ? user.user.id : user.id}\`\`\``, false)
			.addField(`${bot.config.emojis.plus} Registered`, `<t:${~~(user.createdAt / 1000)}:R>`, true)
			.addField(`${bot.config.emojis.join} Joined Server`, `<t:${~~(member.joinedAt / 1000)}:R>`, true)
			.setFooter({
				text: bot.config.embed.footer,
				iconURL: bot.user.displayAvatarURL({ dynamic: true })
			})
			.setColor(roleColor || bot.config.embed.color);

		if (user.flags.toArray().length > 0) InfoEmbed.addField(`${bot.config.emojis.award} Badges`, `${user.flags.toArray().map(b => badges[b] ? badges[b] : b)}`, true);
		if (roles) InfoEmbed.addField(`${bot.config.emojis.trophy} Roles (${roleCount})`, roles, false);

		if (user.user ? user.user.banner : user.banner) InfoEmbed.setImage(user.user ? user.user.bannerURL({ dynamic: true, size: 1024 }) : user.bannerURL({ dynamic: true, size: 1024 }));

		await message.replyT({
			embeds: [InfoEmbed],
		});
	},
	{
		description: "See information about a user.",
		dirname: __dirname,
		usage: "(user)",
		aliases: ["ui"],
		perms: [],
		slash: true,
		options: [
			{
				type: 6,
				name: "user",
				description: "The user to get the information of.",
			}
		]
	},
);
