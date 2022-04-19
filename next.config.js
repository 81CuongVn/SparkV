module.exports = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/invite",
        destination: "https://discord.com/oauth2/authorize?client_id=884525761694933073&permissions=294074575990&scope=bot+applications.commands&redirect_uri=https://www.sparkv.tk/api/auth/callback",
        permanent: false,
      },
      {
        source: "/tos",
        destination: "https://docs.sparkv.tk/legal/terms-of-service",
        permanent: false,
      },
      {
        source: "/privacy",
        destination: "https://docs.sparkv.tk/legal/privacy-policy",
        permanent: false,
      },
      {
        source: "/support",
        destination: "https://discord.gg/PPtzT8Mu3h",
        permanent: false,
      },
      {
        source: "/support",
        destination: "https://status.sparkv.tk/",
        permanent: false,
      }
    ]
  },
}
