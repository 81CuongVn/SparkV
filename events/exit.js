const logger = require("@modules/logger");

exports.run = async code => {
	await logger(`Process exited with code ${code}.`, "error");
};
