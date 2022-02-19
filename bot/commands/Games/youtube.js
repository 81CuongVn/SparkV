const cmd = require("../../templates/gameCommand");

module.exports = new cmd(null, {
	description: "YouTube together!",
	dirname: __dirname,
	usage: "",
	aliases: ["startyt"],
	perms: [],
	gname: "youtube",
	type: "together",
});
