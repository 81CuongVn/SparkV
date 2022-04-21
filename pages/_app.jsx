import { useState, useEffect } from "react";
import Head from "next/head";

import "bootstrap/dist/css/bootstrap.css";
import "aos/dist/aos.css";
import "../styles/global.css";

import config from "../config";

export default function Render({ Component, pageProps }) {
    useEffect(() => {
        import("jquery/src/jquery.js")
        import("bootstrap/dist/js/bootstrap");
        import("aos/dist/aos.js");
        import("smooth-scroll/dist/smooth-scroll.polyfills.js");
        import("../public/js/handle");
    }, []);

    return <Component {...pageProps} />;
}
