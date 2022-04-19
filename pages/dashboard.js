const Express = require("express");
const Discord = require("discord.js");
const Router = Express.Router();

const checkAuth = require("../utils/checkAuth");
const render = require("../utils/render");
const database = require("../database/handler");

Router.get("/", checkAuth, async (req, res) => {
  let guilds = [];
  let ownedGuilds = [];

  req.user.guilds.sort((a, b) => a.name.localeCompare(b.name)).filter(g => g.owner).forEach(g => ownedGuilds.push(g))
  req.user.guilds.sort((a, b) => a.name.localeCompare(b.name)).forEach(g => {
    const perms = new Discord.Permissions(g.permissions_new);

    if (perms.has(Discord.Permissions.FLAGS.MANAGE_GUILD)) guilds.push(g);
  })

  render(res, req, "dashboard/dashboard.ejs", {
    ownedGuilds,
    guilds
  })
});

Router.get("/:id", checkAuth, async (request, response) => {
    let guilds = []

  request.user.guilds.sort((a, b) => a.name.localeCompare(b.name)).forEach(g => {
    const perms = new Discord.Permissions(g.permissions_new);

    if (perms.has(Discord.Permissions.FLAGS.MANAGE_GUILD)) guilds.push(g);
  })

  const guild = request.bot.guilds.cache.get(request.params.id);

  if (!guild) return response.redirect("/?error=no_perms");

  const user = guild.members.cache.get(request.user.id) || (await guild.members.fetch(request.user.id));

  if (!user) return response.redirect("/?error=user_invalid");

  if (!user.permissions.has(Discord.Permissions.FLAGS.MANAGE_GUILD))
    return response.redirect("/?error=no_user_perms");

  const settings = await database.getGuild(request.params.id);

  return render(response, request, "dashboard/guild.ejs", {
    guilds,
    guild,
    settings,
    alert: null
  });
});

Router.post("/:id", checkAuth, async (request, response) => {
  console.log(request.body);
  const guild = request.bot.guilds.cache.get(request.params.id);

  if (!guild) return response.redirect("/?error=no_perms");

  const user = guild.members.cache.get(request.user.id) || await guild.members.fetch(request.user.id);

  if (!user) return response.redirect("/?error=user_invalid");

  if (!user.permissions.has(Discord.Permissions.FLAGS.MANAGE_GUILD)) return response.redirect("/?error=no_user_perms");

  const settings = await database.getGuild(request.params.id);

  try {
    if (Object.prototype.hasOwnProperty.call(request.body, "welcome_enabled")) {
      settings.plugins.welcome = {
        enabled: request.body.welcome_enabled || settings.plugins.welcome.enabled,
        message: request.body.welcome_message || settings.plugins.welcome.message,
        channel: request.body.welcome_channel || settings.plugins.welcome.channel,
        roles: request.body.welcome_roles || settings.plugins.welcome.roles
      };

      settings.markModified("plugins.welcome");
      await settings.save();
    }

    if (Object.prototype.hasOwnProperty.call(request.body, "goodbye_enabled")) {
      settings.plugins.goodbye = {
        enabled: request.body.goodbye_enabled || settings.plugins.goodbye.enabled,
        message: request.body.goodbye_message || settings.plugins.goodbye.message,
        channel: request.body.goodbye_channel || settings.plugins.goodbye.channel
      };

      settings.markModified("plugins.goodbye");
      await settings.save();
    }

    if (Object.prototype.hasOwnProperty.call(request.body, "leveling_enabled")) {
      settings.plugins.leveling = {
        enabled: request.body.leveling_enabled || settings.plugins.leveling.enabled,
        message: request.body.leveling_message || settings.plugins.leveling.message,
        channel: request.body.leveling_channel || settings.plugins.leveling.channel
      };

      settings.markModified("plugins.leveling");
      await settings.save();
    }

    Object.entries(request.body).forEach(setting => {
      if (setting[0] === "chatbot") {
        settings.plugins.chatbot = setting[1];

        settings.markModified("plugins.chatbot")
      } else if (setting[0] === "automod_removeLinks") {
        settings.plugins.automod.removeLinks = setting[1];

        settings.markModified("plugins.automod.removeLinks")
      } else if (setting[0] === "automod_removeProfanity") {
        settings.plugins.automod.removeProfanity = setting[1];

        settings.markModified("plugins.automod.removeProfanity")
      } else if (setting[0] === "automod_removeDuplicateText") {
        settings.plugins.automod.removeDuplicateText = setting[1];

        settings.markModified("plugins.automod.removeDuplicateText")
      } else {
        settings[setting[0]] = setting[1];
        settings.markModified(setting[0])
      }
    })

    await settings.save();
  } catch (err) {
    console.error(err);

    return render(response, request, "dashboard/guild.ejs", {
      guild,
      settings,
      alert: {
        type: "danger",
        message: `Uh oh! We encountered an error while trying to save your data.`
      }
    });
  }

  return render(response, request, "dashboard/guild.ejs", {
    guild,
    settings,
    alert: {
      type: "success",
      message: "Successfully saved settings!"
    }
  });
});

module.exports = Router;
