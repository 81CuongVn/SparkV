const Discord = require("discord.js");
const EasyPages = require("discordeasypages");

const cmd = require("../../templates/command");

const Rules = new Discord.Collection();
let SetRules = false;

module.exports = new cmd(
	(bot, message, args, command, data) => {
		if (SetRules === false) {
			Rules.set(1, {
				Title: "Automation",
				Description:
          "Using automation (Ex: auto-typers) is forbidden. Using automation (and with found proof) will cause a wipe of your data and a ban from using SparkV.",
			});

			Rules.set(2, {
				Title: "Command Spamming",
				Description:
          "Spamming commands is forbidden. Spamming SparkV's commands will result with a warning. If continued, a complete wipe of your data and a ban from SparkV",
			});

			Rules.set(3, {
				Title: "Alternate Accounts",
				Description:
          "Using alternate accounts to earn yourself money is forbidden. If continued (with found proof), your data will be wiped and you will be banned from SparkV.",
			});

			SetRules = true;
		}

		const pages = [];

		const CreatePage = (bot, Message, RuleNumber, RuleTitle, RuleDescription) => {
			const NewEmbed = new Discord.MessageEmbed()
				.setTitle(`Rule #${RuleNumber} - ${RuleTitle}`)
				.setDescription(`\`\`\`${RuleDescription}\`\`\``)
				.setColor(bot.config.embed.color)
				.setThumbnail(
					Message.author.displayAvatarURL({
						dynamic: true,
						format: "gif",
					}),
				);

			pages.push(NewEmbed);
		};

		Rules.map((RuleDetails, RuleNumber) =>
			CreatePage(bot, message, RuleNumber, RuleDetails.Title, RuleDetails.Description),
		);
		EasyPages(message, pages, ["⬅", "➡"]);
	},
	{
		description: "Follow them lol.",
		dirname: __dirname,
		usage: "",
		aliases: ["TOS"],
		perms: ["EMBED_LINKS", "MANAGE_MESSAGES"],
	},
);
