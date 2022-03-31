const logger = require("@modules/logger");

exports.run = async warning => {
	await logger(`${warning.name} - ${warning.message}`, "warn");
};
