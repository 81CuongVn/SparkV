const Express = require("express");
const Router = Express.Router();

Router.get("/:id", async (req, res) => res.redirect(`https://discord.com/oauth2/authorize?client_id=884525761694933073&permissions=294074575990&scope=bot+applications.commands&redirect_uri=https://www.sparkv.tk/api/auth/callback&disable_guild_select=true&guild_id=${req.params.id}`));

module.exports = Router;
