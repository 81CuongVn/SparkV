import config from "../../../config";
import { setCookie } from 'nookies';

const scopes = [
    "identify",
    "guilds"
];

export default async function AuthLogin(req, res) {
    if (req.query.dt == "true") {
        setCookie({ res }, "__SparkVSession", "", {
            maxAge: 0,
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            path: '/'
        });
    };

    const query = new URLSearchParams({
        client_id: config.client_ID,
        scope: scopes.join(" "),
    });

    query.set("redirect_uri", `${config.meta.site}/api/auth/callback`);
    query.set("response_type", "code");

    const state = req.query.state || null;

    if (state) query.set("state", state);
    query.set("prompt", "none");

    res.redirect(`https://discord.com/api/oauth2/authorize?${query.toString()}`);
}