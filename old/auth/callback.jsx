import { useRouter } from 'next/router';
import nookies from "nookies";
import formData from "form-data";

import config from "../../config";
import session from "../../../models/session";
import dbConnect from "../../../lib/dbConnect";

const scopes = [
    "identify",
    "guilds"
];

export default async function AuthCallback(req, res) {
    await dbConnect()

    const code = req.query.code;

    if (!code) {
        if (req.query.error) {
            const error = req.query.error;

            if (error === "access_denied") return res.redirect("/");
        }

        return res.send("No code");
    }

    const tokenData = new formData();
    tokenData.append("client_id", config.client_ID)
    tokenData.append("client_secret", process.env.SECRET)
    tokenData.append("grant_type", "authorization_code")
    tokenData.append("redirect_uri", `${config.meta.site}/api/auth/callback`)
    tokenData.append("scopes", "identify guilds")
    tokenData.append("code", code)

    const token = await fetch("https://discordapp.com/api/oauth2/token", {
      method: "POST",
      body: tokenData
    }).then(t => t.json()).catch(err => {
		return res.send("An error occured with the token request. Please try again later.");
	});

    if (!token.access_token) return res.send("No access token returned from Discord. Please try again later.");

    const customID = Math.random() + 1;
    nookies.set({ res }, "__SparkVSession", customID, {
        maxAge: 5 * 60 * 60, // 5 hours
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        path: "/"
    });

    const user = await fetch("https://discord.com/api/v9/users/@me", {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${token.access_token}`
        },
    }).then(u => u.json()).catch(err => {
		return res.send("An error occured with fetching user data. Please try again later.");
	});

    const guilds = await fetch("https://discord.com/api/v9/users/@me/guilds", {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${token.access_token}`
        },
    }).then(g => g.json()).catch(err => {
        return res.send("An error occured with fetching guild data. Please try again later.");
    });

    let data = await session.findOne({
        id: user.id
    })

    if (!data) {
        data = new session({
            id: user.id,
            customID,
            username: user.username,
            discriminator: user.discriminator,
            accessToken: token.access_token,
            avatar: user.avatar,
            banner: user.banner,
            guilds: guilds
        });
        await data.save();
    } else {
        data.customID = customID;
        await data.markModified("customID");
        data.username = user.username;
        await data.markModified("username");
        data.discriminator = user.discriminator;
        await data.markModified("discriminator");
        data.access_token = token.access_token;
        await data.markModified("access_token");
        data.avatar = user.avatar;
        await data.markModified("avatar");
        data.banner = user.banner;
        await data.markModified("banner");
        data.guilds = guilds;
        await data.markModified("guilds");
        await data.save();
    }

    const guildId = req.query.guild_id;
    const state = req.query.state;

    if (guildId) {
        return res.redirect(`/dashboard/guilds/${guildId}`);
    } else if (state) {
        res.redirect(state)
    } else res.redirect("/dashboard");
}