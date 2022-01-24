const animalCommand = require("../../templates/animalCommand");

module.exports = new animalCommand({
	description: "I will send a cute fox! Ducks are cuter.",
	dirname: __dirname,
	aliases: ["cutefox"],
	usage: "",
	enabled: true,
	endpoint: "https://randomfox.ca/floof/",
	type: "image",
});
