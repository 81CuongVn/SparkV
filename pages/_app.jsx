import { useState, useEffect } from "react";
import Head from "next/head";

import "../styles/global.css";

import config from "../config";

export default function render({ Component, pageProps }) {
    return (
        <Component {...pageProps} />
    );
}
