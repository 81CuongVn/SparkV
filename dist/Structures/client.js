"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const util_1 = __importDefault(require("util"));
const discord_js_1 = require("discord.js");
const statcord_js_1 = __importDefault(require("statcord.js"));
const discord_together_1 = require("discord-together");
const music_1 = __importDefault(require("../Utils/music"));
const shopdata_json_1 = __importDefault(require("../shopdata.json"));
const config_json_1 = __importDefault(require("../config.json"));
const logger_1 = __importDefault(require("../utils/logger"));
const updateDocs_1 = __importDefault(require("../Utils/updateDocs"));
class bot extends discord_js_1.Client {
    constructor(settings) {
        super(settings);
        // Config
        this.config = config_json_1.default;
        // Utils
        this.logger = logger_1.default;
        this.functions = require("../Utils/functions");
        this.wait = util_1.default.promisify(setTimeout);
        // Database
        this.database = require("../Database/handler");
        this.GuildSchema = require("../Database/schemas/guild")?.default;
        this.MemberSchema = require("../Database/schemas/member")?.default;
        this.UserSchema = require("../Database/schemas/user")?.default;
        // Collections
        this.categories = new discord_js_1.Collection();
        this.commands = new discord_js_1.Collection();
        this.aliases = new discord_js_1.Collection();
        this.events = new discord_js_1.Collection();
        this.cooldowns = new discord_js_1.Collection();
        this.shop = new discord_js_1.Collection();
        this.slashCommands = [];
        // Init functions
        this.functions.init(this);
        return this;
    }
    /* -------------------------------------------------- LOAD MODULES --------------------------------------------------*/
    async LoadModules(settings) {
        (0, music_1.default)(this);
        this.activities = new discord_together_1.DiscordTogether(this);
        for (let i = 0; i < shopdata_json_1.default.length; i++) {
            shopdata_json_1.default[i].ids.push(shopdata_json_1.default[i].name);
            this.shop.set(shopdata_json_1.default[i].name, shopdata_json_1.default[i]);
        }
        if (settings?.sharding === true) {
            this.StatClient = statcord_js_1.default.ShardingClient;
        }
        else {
            this.StatClient = new statcord_js_1.default.Client({
                client: this,
                key: process.env.STATCORDAPIKEY,
                postCpuStatistics: true,
                postMemStatistics: true,
                postNetworkStatistics: true,
                autopost: true
            });
        }
        // This.StatClient.registerCustomFieldHandler(1, async client => await this.distube.voices.collection.size.toString() ?? "0");
        if (process.env.REDIS_URL) {
            this.redis = require("redis").createClient({
                url: process.env.REDIS_URL
            });
            await this.redis.connect();
        }
        else {
            return this.logger("Redis URI not found in environment variables. Please add it to your secrets manager so that commands that require a cache (Animals, Memes, Etc) can function.", "warning");
        }
    }
    /* -------------------------------------------------- LOAD EVENTS --------------------------------------------------*/
    async LoadEvents(MainPath) {
        for (const category of fs_1.default.readdirSync(`${MainPath}/Events`)) {
            for (const file of fs_1.default.readdirSync(`${MainPath}/Events/${category}`).filter(file => file.endsWith(".js"))) {
                const event = (await Promise.resolve().then(() => __importStar(require(path_1.default.resolve(`${MainPath}/Events/${category}/${file}`))))).default;
                const handleArgs = (...args) => event.execute(this, ...args);
                event.once ? this.once(file.split(".")[0], handleArgs) : this.on(file.split(".")[0], handleArgs);
            }
        }
    }
    /* -------------------------------------------------- LOAD COMMANDS --------------------------------------------------*/
    async LoadCommands() {
        fs_1.default.readdirSync("./Commands/Slash/").map((cat) => {
            const category = require(`../Commands/Slash/${cat}/index.js`)?.default;
            this.categories.set(cat, category);
            fs_1.default.readdirSync(`./Commands/Slash/${cat}/`).filter(f => f.endsWith(".js") && !(f.startsWith("index"))).map((cmd) => {
                let command = require(`../Commands/Slash/${cat}/${cmd}`).default;
                let commandName = cmd.split(".")[0];
                if (!command)
                    return;
                command.category = category.name;
                command.settings.name = commandName;
                command.description = category.description;
                if (!this.categories.has(command.category))
                    this.categories.set(command.category, category);
                if (this.commands.has(commandName))
                    return this.logger(`You cannot set command ${commandName} because it is already in use by the command ${this.commands.get(commandName).settings.name}. This is most likely due to a accidental clone of a command with the same name.`, "error");
                this.commands.set(commandName, command);
                if (command.settings.description.length >= 100)
                    command.settings.description = `${command.settings.description.slice(0, 96)}...`;
                command.settings.slash === true && this.slashCommands.push({
                    name: commandName,
                    description: command.settings.description,
                    options: command.settings.options || [],
                    type: 1
                });
            });
        });
        fs_1.default.readdirSync(`./Commands/Text`).filter(file => file.endsWith(".js")).forEach(file => {
            const commandname = file.split(".")[0];
            const command = require(`../Commands/Text/${file}`)?.default;
            if (!command || !command.settings)
                return;
            command.settings.name = commandname;
            if (this.commands.has(commandname))
                return this.logger(`You cannot set command ${commandname} because it is already in use by the command ${this.commands.get(commandname).settings.name}. This is most likely due to a accidental clone of a command with the same name.`, "error");
            this.commands.set(commandname, command);
            if (!command.settings.aliases)
                return;
            for (const alias of command.settings.aliases) {
                if (!alias)
                    return;
                if (this.aliases.has(alias))
                    return this.logger(`You cannot set alias ${alias} to ${command.settings.name} because it is already in use by the command ${this.aliases.get(alias).settings.name}.`, "error");
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
    async LoadSlashCommands(slashCommands) {
        const ready = this.readyAt ? Promise.resolve() : new Promise(r => this.once("ready", r));
        await ready;
        // Dev: process.argv.includes("--dev") === true && { guildId: "763803059876397056" }
        const currentCmds = await this.application.commands.fetch().catch(() => { });
        const newCmds = slashCommands.filter((cmd) => !currentCmds.some((c) => c.name === cmd.name));
        for (const newCmd of newCmds)
            await this.application.commands.create(newCmd, process.argv.includes("--dev") === true && "763803059876397056");
        const removedCmds = currentCmds.filter((cmd) => !slashCommands.some((c) => c.name === cmd.name)).toJSON();
        for (const removedCmd of removedCmds)
            await removedCmd.delete();
        const updatedCmds = slashCommands.filter((cmd) => slashCommands.some((c) => c.name === cmd.name));
        for (const updatedCmd of updatedCmds) {
            const newCmd = updatedCmd;
            const previousCmd = currentCmds.find((c) => c.name === newCmd.name);
            let modified = false;
            if (previousCmd && previousCmd.description !== newCmd.description)
                modified = true;
            if (!discord_js_1.ApplicationCommand.optionsEqual(previousCmd?.options || [], newCmd?.options || []))
                modified = true;
            if (previousCmd && modified)
                await previousCmd.edit(updatedCmd);
        }
        updateDocs_1.default.update(this);
        this.logger(`[App] ${currentCmds.size + newCmds.length - removedCmds.length} Slash commands updated and ready!`);
    }
}
exports.default = bot;
;
//# sourceMappingURL=client.js.map