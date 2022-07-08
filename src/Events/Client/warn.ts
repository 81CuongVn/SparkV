import Discord from "discord.js";

import logger from "../../Utils/logger";

export default {
	once: false,
	async execute(bot: any, event: any) {
		await logger(`Warning! - ${event}`, "warn");
	},
};
