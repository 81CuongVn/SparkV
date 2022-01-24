const animalCommand = require("../../templates/animalCommand");

module.exports = new animalCommand({
	description: "I will send a cute dog! Aweeeee :D",
	dirname: __dirname,
	aliases: ["cutedog"],
	usage: "",
	enabled: true,
	endpoint: "https://dog.ceo/api/breeds/image/random",
	type: "image",
});
