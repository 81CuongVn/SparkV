const fs = require("fs");
const path = require("path");
const util = require("util");

const { Client, Collection, Intents, Structures, ApplicationCommand } = require("discord.js");
const { DiscordTogether } = require("discord-together");
const Statcord = require("statcord.js");

const Distube = require("@modules/dependencies/distubehandler");
const giveawayshandler = require("@modules/dependencies/giveawayshandler");
const updateDocs = require("@modules/updateDocs");

const shopdata = require("../shopdata.json");

const GuildSchema = require("@database/schemas/guild");
const MemberSchema = require("@database/schemas/member");
const UserSchema = require("@database/schemas/user");

module.exports = class bot extends Client {
	constructor(settings) {
		super(settings);

		// Config
		this.config = require("@root/globalconfig.json");

		// Utils
		this.logger = require("@modules/logger");
		this.functions = require("@modules/functions");
		this.wait = util.promisify(setTimeout);

		// Database
		this.database = require("@database/handler");

		this.GuildSchema = require("@database/schemas/guild");
		this.MemberSchema = require("@database/schemas/member");
		this.UserSchema = require("@database/schemas/user");

		// Collections
		this.categories = new Collection();
		this.commands = new Collection();
		this.aliases = new Collection();
		this.events = new Collection();
		this.cooldowns = new Collection();
		this.shop = new Collection();

		this.slashCommands = [];

		// Start functions
		require("@modules/functions").init(this);

		return this;
	}

	async LoadModules(settings) {
		// Functions
		this.database.init(this);
		Distube(this);
		giveawayshandler(this);

		for (let i = 0; i < shopdata.length; i++) {
			shopdata[i].ids.push(shopdata[i].name);

			this.shop.set(shopdata[i].name, shopdata[i]);
		}

		if (settings.sharding === true) {
			this.StatClient = await new Statcord.ShardingClient({
				client: this,
				key: process.env.STATCORDAPIKEY,
				postCpuStatistics: true,
				postMemStatistics: true,
				postNetworkStatistics: true,
				autopost: true
			});
		} else {
			this.StatClient = await new Statcord.Client({
				client: this,
				key: process.env.STATCORDAPIKEY,
				postCpuStatistics: true,
				postMemStatistics: true,
				postNetworkStatistics: true,
				autopost: true
			});
		}

		this.StatClient.registerCustomFieldHandler(1, async client => await this.distube.voices.collection.size.toString() ?? "0");

		this.discordTogether = new DiscordTogether(this);

		if (process.env.REDIS_URL) {
			this.redis = require("redis").createClient({
				url: process.env.REDIS_URL
			});

			await this.redis.connect();
		} else {
			return this.logger("Redis URI not found in environment variables. Please add it to your secrets manager so that commands that require a cache (Animals, Memes, Etc) can function.", "warning");
		}
	}

	async LoadEvents(MainPath) {
		const events = fs.readdirSync(path.join(`${MainPath}/events`)).filter(file => file.endsWith(".js"));

		for (const eventF of events) {
			const event = require(path.resolve(`${MainPath}/events/${eventF}`));

			if (event.once) {
				this.once(eventF.split(".")[0], (...args) => event.execute(this, ...args));
			} else {
				this.on(eventF.split(".")[0], (...args) => event.execute(this, ...args));
			}
		}
	}

	async LoadCommands(MainPath) {
		await fs.readdir(path.join(`${MainPath}/commands`), async (err, cats) => {
			if (err) return this.logger(`Commands failed to load! ${err}`, "error");

			await cats.forEach(async cat => {
				const category = require(path.join(`${MainPath}/commands/${cat}`));
				this.categories.set(category.name, category);

				await fs.readdir(path.join(`${MainPath}/commands/${cat}`), async (err, files) => {
					if (err) return this.logger(`Commands failed to load! ${err}`, "error");

					await files.forEach(async file => {
						if (!file.endsWith(".js")) return;

						const commandname = file.split(".")[0];
						const command = require(path.resolve(`${MainPath}/commands/${cat}/${commandname}`));

						if (!command || !command.settings || command.config) return;

						command.category = category.name;
						command.description = category.description;

						if (!this.categories.has(command.category)) this.categories.set(command.category, category);

						command.settings.name = commandname;

						if (this.commands.has(commandname)) {
							const existingCommand = this.commands.get(commandname);

							return this.logger(
								`You cannot set command ${commandname} because it is already in use by the command ${existingCommand.settings.name}. This is most likely due to a accidental clone of a command with the same name.`,
								"error",
							);
						}

						this.commands.set(commandname, command);

						if (command.settings.slash && command.settings.slash === true) {
							if (command.settings.description.length >= 100) command.settings.description = `${command.settings.description.slice(0, 96)}...`;

							await this.slashCommands.push({
								name: commandname,
								description: command.settings.description,
								options: command.settings.options || [],
								type: command.settings.type || 1,
							});
						}

						if (!command.settings.aliases) return;

						for (const alias of command.settings.aliases) {
							if (!alias) return;

							if (this.aliases.has(alias)) {
								const existingCommand = this.aliases.get(alias);

								return this.logger(
									`You cannot set alias ${alias} to ${command.settings.name} because it is already in use by the command ${existingCommand.settings.name}.`,
									"error",
								);
							}

							this.aliases.set(alias, command);
						}
					});
				});
			});
		});

		// Coming soon: App commands
		// These commands will be accessable from right-clicking on a user/message in Discord.
		// await fs.readdir(path.join(`${MainPath}/appCommands`), async (err, files) => {
		// 	if (err) return this.logger(`App commands failed to load! ${err}`, "error");

		// 	await files.forEach(async file => {
		// 		if (!file.endsWith(".js")) return;

		// 		const commandname = file.split(".")[0];
		// 		const command = require(path.resolve(`${MainPath}/appCommands/${commandname}`));

		// 		if (!command || !command.settings || command.config) return;

		// 		command.settings.name = commandname;

		// 		await this.slashCommands.push({
		// 			name: commandname,
		// 			type: command.settings.type,
		// 		});
		// 	});
		// });

		await this.LoadSlashCommands(this.slashCommands);
	}

	async LoadSlashCommands(slashCommands) {
		const ready = this.readyAt ? Promise.resolve() : new Promise(r => this.once("ready", r));
		await ready;

		const currentCmds = await this.application.commands.fetch(process.argv.includes("--dev") === true && { guildId: "763803059876397056" });

		const newCmds = slashCommands.filter(cmd => !currentCmds.some(c => c.name === cmd.name));
		for (const newCmd of newCmds) {
			await this.application.commands.create(newCmd, process.argv.includes("--dev") === true && "763803059876397056");
		}

		const removedCmds = currentCmds.filter(cmd => !slashCommands.some(c => c.name === cmd.name)).toJSON();
		for (const removedCmd of removedCmds) {
			await removedCmd.delete();
		}

		const updatedCmds = slashCommands.filter(cmd => slashCommands.some(c => c.name === cmd.name));
		let updatedCount = 0;
		for (const updatedCmd of updatedCmds) {
			const newCmd = updatedCmd;

			const previousCmd = currentCmds.find(c => c.name === updatedCmd.name);
			let modified = false;

			if (previousCmd && previousCmd.description !== newCmd.description) modified = true;
			if (!ApplicationCommand.optionsEqual(previousCmd?.options || [], newCmd?.options || [])) modified = true;

			if (previousCmd && modified) {
				await previousCmd.edit(updatedCmd);
				updatedCount++;
			}
		}

		updateDocs.update(this, process.env.MainDir);

		this.logger(`[App] ${currentCmds.size + newCmds.length - removedCmds.length} Slash commands updated and ready!`);
	}
};
