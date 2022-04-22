import React from "react";
import { parseCookies } from "nookies";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";

import config from "../config";

import hero from "../styles/hero.module.css";
import loader from "../styles/loader.module.css";

import Header from "../components/head";
import Navbar from "../components/navbar";

export default function Render({ statusCode }) {
    return (
        <>
            <Head>
                <Header name={`${config.name} | Error`} description={`Wow, you encountered an error! Our team have been notified, are are working on a fix. ${config.meta.description}`} logo="https://www.sparkv.tk/assets/images/SparkV.png"></Header>
            </Head>
            <body>
                {/* Content */}
                <section className="container-md">
                    <section id="home" style={{ width: "100%", height: "100%", display: "flex", marginTop: "125px", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px", textAlign: "center", margin: "7% 0" }}>
                        <Image defer src={`https://http.cat/${statusCode}`} alt={`Error Code ${statusCode}`} className="img-fluid" width="450" height="250" style={{ borderRadius: "15px" }} />
                        <div className="row" style={{ maxWidth: "800px", justifyContent: "center" }}>
                            <Link href="/"><a type="button" className="col-5 btn btn-info text-white fw-bold" style={{ height: "56px", width: "150px", marginInlineEnd: "16px", borderRadius: "8px" }}>Home</a></Link>
                        </div>
                    </section>
                </section>
            </body>
        </>
    );
}

export async function getInitialProps({ res, err }) {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404;

    return { statusCode };
};
