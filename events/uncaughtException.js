const logger = require("@modules/logger");

exports.run = async (err, promise) => {
	const ErrorMessage = err.stack.toString().replaceAll(new RegExp(`${__dirname}/`, "g"), "./");

	await logger(`Unhandled exception error. ${ErrorMessage}.`, "error");
};
