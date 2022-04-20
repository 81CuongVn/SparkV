const Discord = require("discord.js");
const Express = require("express");

const Router = Express.Router();

const CheckAuth = require("../../utils/checkAuth");
const Render = require("../../utils/render");

Router.get("/", CheckAuth, (request, response) => {
	request.session.destroy(() => {
		request.logout();
    response.redirect("/")
	});
});

module.exports = Router;
