// import config from "../../config";
// import nookies from "nookies";

// export default async function AuthLogout(req, res) {
//     nookies.set({ res }, "__SparkVSession", "", {
//         maxAge: Date.now(), // 5 hours
//         httpOnly: true,
//         secure: process.env.NODE_ENV !== "development",
//         path: "/"
//     });

//     res.redirect("/");
// }