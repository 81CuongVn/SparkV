const animalCommand = require("../../templates/animalCommand");

module.exports = new animalCommand({
	description: "I will send a cute cat! Cute, but dogs are cuter.",
	dirname: __dirname,
	aliases: ["cutecat"],
	usage: "",
	enabled: true,
	endpoint: "https://aws.random.cat/meow",
	type: "image",
});
