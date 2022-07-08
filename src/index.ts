// KingCh1ll //
// 6/20/2022 //

import 'dotenv/config';
async function loader(callback: any) {
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
import chalk from "chalk";
loader(async () => {
	console.log(chalk.grey("​"));
	console.log(figlet.textSync("SparkV"));

	if (process.argv.includes("--dev") === true) {
		console.log(chalk.grey("----------------------------------------"));
		Logger("[DEV] - Developer mode enabled. Some features may not work right on this mode.");
		console.log(chalk.grey("----------------------------------------"));
	}

	checkForUpdate();

	const version:any = process.version.slice(1, 3);
	if (version - 0 < 16) { // how to add typing?
		console.log(chalk.grey("----------------------------------------"));
		Logger("WARNING - VERSION_ERROR => UNSUPPORTED NODE.JS VERSION. PLEASE UPGRADE TO v16.6");
		console.log(chalk.grey("----------------------------------------"));
		return;
	}

	start();
});

// Libarys //
import fs from "fs";
import path from "path";

import discord from "discord.js";
import Statcord from "statcord.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
import axios from "axios";

// Varibles //
import Config from "./config.json";
import Logger from "./Utils/logger";

// Functions //
async function checkForUpdate() {
	try {
		const tag_name = await axios.get("https://api.github.com/repos/Ch1ll-Studio/SparkV/releases/latest").then((response: any) => response.data.tag_name);

		if (Number(tag_name.slice(1)) > Number(require("./config.json")?.version)) {
			console.log(chalk.grey("----------------------------------------"));
			await Logger("WARNING - UPDATE_AVAILABLE => PLEASE UPDATE TO THE LATEST VERSION", "warn");
			console.log(chalk.grey("----------------------------------------"));
		}
	} catch (err: any) {
		console.log(chalk.grey("----------------------------------------"));
		await Logger(`WARNING - UPDATE_CHECK_ERROR => FAILED TO CHECK FOR UPDATE. ${err}`, "warn");
		console.log(chalk.grey("----------------------------------------"));
	}
}

async function start() {
	dotenv.config();

	if (process.env.MONGOOSEURL) {
		await mongoose.connect(process.env.MONGOOSEURL, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		} as {
            bufferCommands?: boolean;
            dbName?: string;
            user?: string;
            pass?: string;
            autoIndex?: boolean;
            autoCreate?: boolean;
        });

		mongoose.connection.on("error", console.error.bind(console, "Database connection error!"));
		mongoose.connection.on("open", () => console.log("[Datebase] Connected and ready."));
	} else {
		Logger("WARNING - NO API KEY FOR MONGOOSE! SPARKV MAY BREAK WITHOUT MONGODB KEY.", "warn");
	}

	process.on("warning", async (warning: any) => await Logger(`${warning.name} - ${warning.message}`, "warn", { data: warning }));
	process.on("exit", async (code: any) => await Logger(`Process exited with code ${code}.`, "error"));
	process.on("uncaughtException", async (err: any) => await Logger(`Unhandled exception error. ${err.stack}.`, "error", { data: err }));
	process.on("unhandledException", async (err: any) => await Logger(`Unhandled exception error. ${err.stack}.`, "error", { data: err }));
	process.on("unhandledRejection", async (err: any) => await Logger(`Unhandled rejection error. ${err}.`, "error", { data: err }));

	process.env.MainDir = __dirname;

	if (process.argv.includes("--sharding") === true) {
		const manager = new discord.ShardingManager("./app.js", {
			token: process.env.TOKEN,
			totalShards: "auto",
			shardArgs: [...process.argv, ...["--sharding"]]
		});

		new Statcord.ShardingClient({
			manager,
			key: (process.env.STATCORDAPIKEY as any),
			postCpuStatistics: true,
			postMemStatistics: true,
			postNetworkStatistics: true,
			autopost: true
		});

		// Shard Handlers //
		manager.on("shardCreate", (shard: any) => {
			Logger(`[SHARD ${shard.id}/${manager.totalShards}] - DEPLOYING`);

			shard.on("ready", () => Logger(`[SHARD ${shard.id}/${manager.totalShards}] - READY`));
			shard.on("disconnect", () => Logger(`[SHARD ${shard.id}/${manager.totalShards}] - DISCONNECTED`, "error"));
			shard.on("death", (event: any) => Logger(`[SHARD ${shard.id}/${manager.totalShards}] - SHARD DIED! ${event.exitCode ? `Exited with code ${event.exitCode}` : "Exited due to lack of available memory."}.`));
		});

		manager.spawn();
	} else {
		await require("./app");
	}
}
