import nookies from "nookies";
import fetch from "node-fetch";
import formData from "form-data";

import config from "../../../config";

const scopes = [
    "identify",
    "guilds"
];

export default async function AuthCallback(req, res) {
    const code = req.query.code;

    if (!code) {
        if (req.query.error) {
            const error = req.query.error;

            if (error === "access_denied") return res.redirect("/");
        }

        return res.send("No code");
    }

    const data = new formData();
    data.append("client_id", config.client_ID)
    data.append("client_secret", process.env.SECRET)
    data.append("grant_type", "authorization_code")
    data.append("redirect_uri", `${config.meta.site}/api/auth/callback`)
    data.append("scopes", "identify guilds")
    data.append("code", code)

    const token = await fetch("https://discordapp.com/api/oauth2/token", {
      method: "POST",
      body: data
    }).then(t => t.json()).catch(err => {
		return res.send("An error occured with the token request. Please try again later.");
	});

    if (!token.access_token) return res.send("No access token");

    nookies.set({ res }, "__SparkVSession", token.access_token, {
        maxAge: 5 * 60 * 60, // 5 hours
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        path: "/",
    });
    
    const guildId = req.query.guild_id;
    const state = req.query.state;

    if (guildId) {
        return res.redirect(`/dashboard/guilds/${guildId}`);
    } else if (state) {
        res.redirect(state)
    } else res.redirect("/dashboard");
}