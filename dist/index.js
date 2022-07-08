"use strict";
// KingCh1ll //
// 6/20/2022 //
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
async function loader(callback) {
    const loading = ["\\", "|", "/", "-"];
    let num = 0;
    const loader = setInterval(async () => {
        process.stdout.write(`\r${loading[num++]} [App] Loading...`);
        num %= loading.length;
    }, 250);
    setTimeout(async () => {
        clearInterval(loader);
        process.stdout.write(`\r${loading[3]} [App] Loading...`);
        callback();
    }, 5000);
}
const figlet_1 = __importDefault(require("figlet"));
const chalk_1 = __importDefault(require("chalk"));
loader(async () => {
    console.log(chalk_1.default.grey("​"));
    console.log(figlet_1.default.textSync("SparkV"));
    if (process.argv.includes("--dev") === true) {
        console.log(chalk_1.default.grey("----------------------------------------"));
        (0, logger_1.default)("[DEV] - Developer mode enabled. Some features may not work right on this mode.");
        console.log(chalk_1.default.grey("----------------------------------------"));
    }
    checkForUpdate();
    const version = process.version.slice(1, 3);
    if (version - 0 < 16) { // how to add typing?
        console.log(chalk_1.default.grey("----------------------------------------"));
        (0, logger_1.default)("WARNING - VERSION_ERROR => UNSUPPORTED NODE.JS VERSION. PLEASE UPGRADE TO v16.6");
        console.log(chalk_1.default.grey("----------------------------------------"));
        return;
    }
    start();
});
const discord_js_1 = __importDefault(require("discord.js"));
const statcord_js_1 = __importDefault(require("statcord.js"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const axios_1 = __importDefault(require("axios"));
const logger_1 = __importDefault(require("./Utils/logger"));
// Functions //
async function checkForUpdate() {
    try {
        const tag_name = await axios_1.default.get("https://api.github.com/repos/Ch1ll-Studio/SparkV/releases/latest").then((response) => response.data.tag_name);
        if (Number(tag_name.slice(1)) > Number(require("./config.json")?.version)) {
            console.log(chalk_1.default.grey("----------------------------------------"));
            await (0, logger_1.default)("WARNING - UPDATE_AVAILABLE => PLEASE UPDATE TO THE LATEST VERSION", "warn");
            console.log(chalk_1.default.grey("----------------------------------------"));
        }
    }
    catch (err) {
        console.log(chalk_1.default.grey("----------------------------------------"));
        await (0, logger_1.default)(`WARNING - UPDATE_CHECK_ERROR => FAILED TO CHECK FOR UPDATE. ${err}`, "warn");
        console.log(chalk_1.default.grey("----------------------------------------"));
    }
}
async function start() {
    dotenv_1.default.config();
    if (process.env.MONGOOSEURL) {
        await mongoose_1.default.connect(process.env.MONGOOSEURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        mongoose_1.default.connection.on("error", console.error.bind(console, "Database connection error!"));
        mongoose_1.default.connection.on("open", () => console.log("[Datebase] Connected and ready."));
    }
    else {
        (0, logger_1.default)("WARNING - NO API KEY FOR MONGOOSE! SPARKV MAY BREAK WITHOUT MONGODB KEY.", "warn");
    }
    process.on("warning", async (warning) => await (0, logger_1.default)(`${warning.name} - ${warning.message}`, "warn", { data: warning }));
    process.on("exit", async (code) => await (0, logger_1.default)(`Process exited with code ${code}.`, "error"));
    process.on("uncaughtException", async (err) => await (0, logger_1.default)(`Unhandled exception error. ${err.stack}.`, "error", { data: err }));
    process.on("unhandledException", async (err) => await (0, logger_1.default)(`Unhandled exception error. ${err.stack}.`, "error", { data: err }));
    process.on("unhandledRejection", async (err) => await (0, logger_1.default)(`Unhandled rejection error. ${err}.`, "error", { data: err }));
    process.env.MainDir = __dirname;
    if (process.argv.includes("--sharding") === true) {
        const manager = new discord_js_1.default.ShardingManager("./app.js", {
            token: process.env.TOKEN,
            totalShards: "auto",
            shardArgs: [...process.argv, ...["--sharding"]]
        });
        new statcord_js_1.default.ShardingClient({
            manager,
            key: process.env.STATCORDAPIKEY,
            postCpuStatistics: true,
            postMemStatistics: true,
            postNetworkStatistics: true,
            autopost: true
        });
        // Shard Handlers //
        manager.on("shardCreate", (shard) => {
            (0, logger_1.default)(`[SHARD ${shard.id}/${manager.totalShards}] - DEPLOYING`);
            shard.on("ready", () => (0, logger_1.default)(`[SHARD ${shard.id}/${manager.totalShards}] - READY`));
            shard.on("disconnect", () => (0, logger_1.default)(`[SHARD ${shard.id}/${manager.totalShards}] - DISCONNECTED`, "error"));
            shard.on("death", (event) => (0, logger_1.default)(`[SHARD ${shard.id}/${manager.totalShards}] - SHARD DIED! ${event.exitCode ? `Exited with code ${event.exitCode}` : "Exited due to lack of available memory."}.`));
        });
        manager.spawn();
    }
    else {
        await require("./app");
    }
}
//# sourceMappingURL=index.js.map