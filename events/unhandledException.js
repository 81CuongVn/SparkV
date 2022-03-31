const logger = require("@modules/logger");

exports.run = async (err, promise) => {
	await logger(`Unhandled exception error. ${err.stack}.`, "error");
};
