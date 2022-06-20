// KingCh1ll //
// 4/22/2021 //

async function loader(callback) {
	const loading: string[] = ["\\", "|", "/", "-"];
	let num: number = 0;

	const loader: NodeJS.Timer = setInterval(async () => {
		process.stdout.write(`\r${loading[num++]} [App] Loading...`);
		num %= loading.length;
	}, 250);

	setTimeout(async () => {
		clearInterval(loader);
		process.stdout.write(`\r${loading[3]} [App] Loading...`);
		callback();
	}, 5000);
}

import figlet from "figlet";
loader(async () => {
	console.log(require("chalk").grey("​"));
	console.log(figlet.textSync("SparkV"));

	if (process.argv.includes("--dev") === true) {
		console.log(require("chalk").grey("----------------------------------------"));
		Logger("[DEV] - Developer mode enabled. Some features may not work right on this mode.");
		console.log(require("chalk").grey("----------------------------------------"));
	}

	checkForUpdate();

	const version:any = process.version.slice(1, 3);
	if (version - 0 < 16) { // how to add typing?
		console.log(require("chalk").grey("----------------------------------------"));
		Logger("WARNING - VERSION_ERROR => UNSUPPORTED NODE.JS VERSION. PLEASE UPGRADE TO v16.6");
		console.log(require("chalk").grey("----------------------------------------"));
		return;
	}

	start();
});

// Libarys //
import fs from "fs";
import path from "path";

import discord from "discord.js";
import Statcord from "statcord.js";
import mongoose from "mongoose";
import axios from "axios";

// Varibles //
import Config from "./config.json";
import Logger from "./utils/logger";

// Functions //
async function checkForUpdate() {
	try {
		const tag_name = await axios.get("https://api.github.com/repos/Ch1ll-Studio/SparkV/releases/latest").then(response => response.data.tag_name);

		if (Number(tag_name.slice(1)) > Number(require("./package.json")?.version)) {
			console.log(require("chalk").grey("----------------------------------------"));
			await Logger("WARNING - UPDATE_AVAILABLE => PLEASE UPDATE TO THE LATEST VERSION", "warn");
			console.log(require("chalk").grey("----------------------------------------"));
		}
	} catch (err) {
		console.log(require("chalk").grey("----------------------------------------"));
		await Logger(`WARNING - UPDATE_CHECK_ERROR => FAILED TO CHECK FOR UPDATE. ${err}`, "warn");
		console.log(require("chalk").grey("----------------------------------------"));
	}
}

async function start() {
	require("dotenv").config();

	if (process.env.MONGOOSEURL) {
		await mongoose.connect(process.env.MONGOOSEURL, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		});
	} else {
		Logger("WARNING - NO API KEY FOR MONGOOSE! SPARKV MAY BREAK WITHOUT MONGODB KEY.", "warn");
	}

	process.on("warning", async warning => await Logger(`${warning.name} - ${warning.message}`, "warn", { data: warning }));
	process.on("exit", async code => await Logger(`Process exited with code ${code}.`, "error"));
	process.on("uncaughtException", async err => await Logger(`Unhandled exception error. ${err.stack}.`, "error", { data: err }));
	process.on("unhandledException", async err => await Logger(`Unhandled exception error. ${err.stack}.`, "error", { data: err }));
	process.on("unhandledRejection", async err => await Logger(`Unhandled rejection error. ${err}.`, "error", { data: err }));

	process.env.MainDir = __dirname;

	if (process.argv.includes("--sharding") === true) {
		const manager = new discord.ShardingManager("./bot/app.js", {
			token: process.env.TOKEN,
			totalShards: "auto",
			shardArgs: [...process.argv, ...["--sharding"]]
		});

		const StatClient = await new Statcord.ShardingClient({
			manager,
			key: process.env.STATCORDAPIKEY,
			postCpuStatistics: true,
			postMemStatistics: true,
			postNetworkStatistics: true,
			autopost: true
		});

		// Shard Handlers //
		manager.on("shardCreate", shard => {
			Logger(`[SHARD ${shard.id}/${manager.totalShards}] - DEPLOYING`);

			shard.on("ready", () => Logger(`[SHARD ${shard.id}/${manager.totalShards}] - READY`));
			shard.on("disconnect", event => Logger(`[SHARD ${shard.id}/${manager.totalShards}] - DISCONNECTED\n${event}`, "error"));
			shard.on("reconnecting", () => Logger(`[SHARD ${shard.id}/${manager.totalShards}] - RECONNECTING`, "warn"));
			shard.on("death", event => Logger(`[SHARD ${shard.id}/${manager.totalShards}] - SHARD DIED! ${event.exitCode ? `Exited with code ${event.exitCode}` : "Exited due to lack of available memory."}.`));
		});

		manager.spawn();
	} else {
		await require("./src/app");
	}
}
