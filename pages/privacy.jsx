import React from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";

import config from "../config";

import hero from "../styles/hero.module.css";

import Header from "../components/head";
import Navbar from "../components/navbar";

export default function Render() {
    return (
        <>
            <Head>
                <Header name={`Privacy Policy - ${config.name}`} description={`Read about how we use your data. ${config.meta.description}`} logo="https://www.sparkv.tk/assets/images/SparkV.png"></Header>
            </Head>
            <body>
                {/* Content */}
                <section className="container-md">
                    <Navbar title="SparkV" logo="/images/SparkV.webp" />

                    <section id="home" style={{ width: "100%", height: "100%", display: "flex", marginTop: "125px", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px", textAlign: "center", margin: "7% 0" }}>
                        <h1 style={{ width: "100%", fontSize: "35px", textAlign: "left", color: "rgb(255, 255, 255, .85)"}}>Privacy Policy</h1>
                        <hr style={{ width: "100%", color: "#333333" }}/>
                        <p style={{ width: "100%", fontSize: "15px", textAlign: "left", color: "var(--sparkv-light)"}}>Last updated March 21st, 2022</p>
                        <p style={{ color: "var(--sparkv-light)" }}>By using SparkV, you agree that you have read and accepted to our privacy policy. If you have any questions or concerns regarding our policy, you can email us here: <Link href="mailto:kingch1ll012@gmail.com">kingch1ll012@gmail.com</Link></p>
                        <p style={{ color: "var(--sparkv-light)" }}>test</p>
                    </section>
                </section>
            </body>
        </>
    );
}
