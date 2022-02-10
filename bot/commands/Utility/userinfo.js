const os = require("os");
const Discord = require("discord.js");

const cmd = require("../../templates/command");

const statuses = {
	online: "🟢",
	idle: "🌙",
	dnd: "🔴",
	offline: "⚫"
};

const badges = {
	HOUSE_BRAVERY: "<:house_bravery:941439956528803860>",
	HOUSE_BRILLIANCE: "<:house_brilliance:941439956507840543>",
	HOUSE_BALANCE: "<:house_balance:941440238486691921>",
};

module.exports = new cmd(
	async (bot, message, args, command, data) => {
		let user = message?.applicationId ? data.options.getMember("user") || message.user : (await bot.functions.fetchUser(args[0]) || message.author);
		const member = message.channel.guild.members.cache.get(user.id);

		const userdata = await bot.database.getUser(user.id);
		// const roles = member.roles.cache.map(r => `<@&${r.id}>`).join(", ");

		user = user.user ? await user.user.fetch() : await user.fetch();

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
				name: user.user ? user.user.tag : user.tag,
				iconURL: user.user
					? user.user.displayAvatarURL({ dynamic: true })
					: user.displayAvatarURL({ dynamic: true }),
			})
			.setThumbnail(user.user ? user.user.displayAvatarURL({ dynamic: true }) : user.displayAvatarURL({ dynamic: true }))
			.addField(`\`${statuses[member?.presence?.status || "offline"]}\` Status`, `${member?.presence?.status || "offline"}`, true)
			.addField("\`⌚\` Joined Server", `<t:${~~(member.joinedAt / 1000)}:R>`, true)
			.addField("\`🚪\` Registered", `<t:${~~(user.createdAt / 1000)}:R>`, true)
			.addField("\`😎\` Using SparkV Since", `<t:${~~(userdata.registrationDate / 1000)}:R>`, true)
			.addField("\`🔢\`Join Position", `${await position || "UNKNOWN"}/${members.length}`, true)
			// .addField("\`🔧\` Roles", roles || "None", false)
			.setFooter({
				text: `🔢 ID: ${user.user ? user.user.id : user.id} • ${bot.config.embed.footer}`,
				iconURL: bot.user.displayAvatarURL({ dynamic: true })
			})
			.setColor(bot.config.embed.color);

		const userflags = user.user ? await user.user.fetchFlags() : await user.fetchFlags();

		if (userflags) InfoEmbed.addField("\`🏅\`Badges", `${user.flags.toArray().map(b => badges[b] ? badges[b] : b)}`, true);
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
		perms: ["EMBED_LINKS"],
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
