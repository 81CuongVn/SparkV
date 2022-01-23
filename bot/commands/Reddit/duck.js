const animalCommand = require("../../templates/animalCommand");

module.exports = new animalCommand({
	description: "Quack :D",
	dirname: __dirname,
	aliases: ["ducc", "cuteduck"],
	usage: "",
	enabled: true,
	endpoint: "https://random-d.uk/api/v2/random",
	type: "image",
});
