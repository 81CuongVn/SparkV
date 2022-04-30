import React from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";

import config from "../config";

import hero from "../styles/hero.module.scss";

import Header from "../components/head";
import Navbar from "../components/navbar";

export default function Render() {
    return (
        <>
            <Head>
                <Header name={`${config.name} | 404`} description={`We couldn't find that page on our server. ${config.meta.description}`} logo="https://www.sparkv.tk/assets/images/SparkV.png"></Header>
            </Head>
                {/* Content */}
                <section className="container-md">
                    <Navbar title="SparkV" logo="/images/SparkV.webp" />

                    <section id="home" style={{ width: "100%", height: "100%", display: "flex", marginTop: "125px", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px", textAlign: "center", margin: "7% 0" }}>
                        <Image defer src="/images/404.svg" alt="SparkV" className="img-fluid" width="450" height="250" style={{ borderRadius: "15px" }} />
                        <p style={{ color: "rgb(255, 255, 255, 0.6)", fontSize: "17.5px", textAlign: "center", marginTop: "20px", marginBottom: "50px", fontWeight: "600" }}>Wait a second... where are we? I think we're lost.</p>
                        <div className="row" style={{ maxWidth: "800px", justifyContent: "center" }}>
                            <Link href="/"><a type="button" className="col-5 button button-blue text-white fw-bold" style={{ height: "56px", width: "150px", marginInlineEnd: "16px", borderRadius: "8px" }}>Home</a></Link>
                        </div>
                    </section>
                </section>
        </>
    );
}
