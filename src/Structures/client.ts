import fs from "fs";
import path from "path";
import util from "util";

import { Client, Collection, ApplicationCommand } from "discord.js";
import Statcord from "statcord.js";

import functions from "../Utils/functions";
import shopdata from "../shopdata.json";

export default class bot extends (Client as any) {
	constructor(settings: any) {
		super(settings);

		// Config
		this.config = require("../config.json");

		// Utils
		this.logger = require("../utils/logger");
		this.functions = require("../utils/functions");
		this.wait = util.promisify(setTimeout);

		// Database
		this.database = require("../Database/handler");

		this.GuildSchema = require("../Database/schemas/guild");
		this.MemberSchema = require("../Database/schemas/member");
		this.UserSchema  = require("../Database/schemas/user");

		// Collections
		this.categories = new Collection();
		this.commands = new Collection();
		this.aliases = new Collection();
		this.events = new Collection();
		this.cooldowns = new Collection();
		this.shop = new Collection();

		this.slashCommands = [];

		// Start functions
		functions.init(this);

		return this;
	}

	async LoadModules(settings: any) {
		// Functions
		this.database.init(this);
		require("../Utils/music")(this);

		for (let i = 0; i < shopdata.length; i++) {
			shopdata[i].ids.push(shopdata[i].name);

			this.shop.set(shopdata[i].name, shopdata[i]);
		}

		if (settings?.sharding === true) {
			this.StatClient = Statcord.ShardingClient;
		} else {
			this.StatClient = new Statcord.Client({
				client: (this as any),
				key: (process.env.STATCORDAPIKEY as any),
				postCpuStatistics: true,
				postMemStatistics: true,
				postNetworkStatistics: true,
				autopost: true
			} as {
				client: any,
				key: string,
				postCpuStatistics: boolean,
				postMemStatistics: boolean,
				postNetworkStatistics: boolean,
				autopost: boolean
			});
		}

		// This.StatClient.registerCustomFieldHandler(1, async client => await this.distube.voices.collection.size.toString() ?? "0");

		if (process.env.REDIS_URL) {
			this.redis = require("redis").createClient({
				url: process.env.REDIS_URL
			});

			await this.redis.connect();
		} else {
			return this.logger("Redis URI not found in environment variables. Please add it to your secrets manager so that commands that require a cache (Animals, Memes, Etc) can function.", "warning");
		}
	}

	async LoadEvents(MainPath: string) {
		for (const category of fs.readdirSync(`${MainPath}/Events`)) {
			for (const file of fs.readdirSync(`${MainPath}/Events/${category}`)) {
				const event = require(path.resolve(`${MainPath}/Events/${category}/${file}`));
				const handleArgs = (...args: any) => event.execute(this, ...args);

				event.once ? this.once(file.split(".")[0], handleArgs) : this.on(file.split(".")[0], handleArgs);
			}
		}
	}

	async LoadCommands(MainPath: string) {
		fs.readdirSync(`${MainPath}/Commands/Slash`).forEach(cat => {
			const category = require(path.join(`${MainPath}/Commands/Slash/${cat}`));
			this.categories.set(category.name, category);
			fs.readdirSync(`${MainPath}/Commands/Slash/${cat}`).forEach(async file => {
				if (!file.endsWith(".ts")) return;

				const commandname = file.split(".")[0];
				const command = require(path.resolve(`${MainPath}/Commands/Slash/${cat}/${commandname}`));

				if (!command || !command.settings) return;

				command.category = category.name;
				command.settings.name = commandname;
				command.description = category.description;

				if (!this.categories.has(command.category)) this.categories.set(command.category, category);
				if (this.commands.has(commandname)) return this.logger(`You cannot set command ${commandname} because it is already in use by the command ${this.commands.get(commandname).settings.name}. This is most likely due to a accidental clone of a command with the same name.`, "error");

				this.commands.set(commandname, command);

				if (command.settings.description.length >= 100) command.settings.description = `${command.settings.description.slice(0, 96)}...`;

				await this.slashCommands.push({
					name: commandname,
					description: command.settings.description,
					options: command.settings.options || [],
					type: command.settings.type || 1
				});
			});
		});

		fs.readdirSync(`${MainPath}/Commands/Text`).forEach(file => {
			if (!file.endsWith(".ts")) return;

			const commandname = file.split(".")[0];
			const command = require(path.resolve(`${MainPath}/Commands/Text/${commandname}`));

			if (!command || !command.settings) return;

			command.settings.name = commandname;

			if (this.commands.has(commandname)) return this.logger(`You cannot set command ${commandname} because it is already in use by the command ${this.commands.get(commandname).settings.name}. This is most likely due to a accidental clone of a command with the same name.`, "error");
			this.commands.set(commandname, command);

			if (!command.settings.aliases) return;
			for (const alias of command.settings.aliases) {
				if (!alias) return;
				if (this.aliases.has(alias)) return this.logger(`You cannot set alias ${alias} to ${command.settings.name} because it is already in use by the command ${this.aliases.get(alias).settings.name}.`, "error");

				this.aliases.set(alias, command);
			}
		});

		// Coming soon: App commands
		// These commands will be accessable = require(right-clicking on a user/message in Discord.
		// await fs.readdir(path.join(`${MainPath}/appCommands`), async (err, files) => {
		// 	if (err) return this.logger(`App commands failed to load! ${err}`, "error");

		// 	await files.forEach(async file => {
		// 		if (!file.endsWith(".ts")) return;

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

	async LoadSlashCommands(slashCommands: string[]) {
		const ready = this.readyAt ? Promise.resolve() : new Promise(r => this.once("ready", r));
		await ready;

		// Dev: process.argv.includes("--dev") === true && { guildId: "763803059876397056" }
		const currentCmds = await this.application.commands.fetch().catch((): any => {});

		const newCmds = slashCommands.filter((cmd: any) => !currentCmds.some((c: any) => c.name === cmd.name));
		for (const newCmd of newCmds) await this.application.commands.create(newCmd, process.argv.includes("--dev") === true && "763803059876397056");

		const removedCmds = currentCmds.filter((cmd: any) => !slashCommands.some((c: any) => c.name === cmd.name)).toJSON();
		for (const removedCmd of removedCmds) await removedCmd.delete();

		const updatedCmds = slashCommands.filter((cmd: any) => slashCommands.some((c: any) => c.name === cmd.name));
		for (const updatedCmd of updatedCmds) {
			const newCmd: any = updatedCmd;
			const previousCmd = currentCmds.find((c: any) => c.name === newCmd.name);
			let modified = false;

			if (previousCmd && previousCmd.description !== newCmd.description) modified = true;
			if (!ApplicationCommand.optionsEqual(previousCmd?.options || [], newCmd?.options || [])) modified = true;
			if (previousCmd && modified) await previousCmd.edit(updatedCmd);
		}

		require("@utils/updateDocs").update(this, process.env.MainDir);
		this.logger(`[App] ${currentCmds.size + newCmds.length - removedCmds.length} Slash commands updated and ready!`);
	}
};
