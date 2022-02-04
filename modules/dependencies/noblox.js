const noblox = require("noblox.js");

module.exports = async bot => {
	if (!process.env.ROBLOXCOOKIE) return;
	if (process.argv.includes("--dev") === true) return;

	try {
		const CurrentUser = await noblox.setCookie(process.env.ROBLOXCOOKIE);

		console.log(`🤖 | Logged into Roblox as ${CurrentUser.UserName} (${CurrentUser.UserID})`);
	} catch (e) {
		console.log(`⛔ | Uh oh! Failed to log into Roblox. Is your cookie correct?`);
	}
};
