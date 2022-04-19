import { useState, useLayoutEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";

import config from "../config";

import "../styles/hero.module.css";
import "../styles/loader.module.css";

import Header from "../components/head";
import Navbar from "../components/navbar";
import Hero from "../components/hero";

import { HiOutlineNewspaper, HiOutlineLink, HiX, HiOutlineExclamation, HiOutlineFolder, HiOutlineMenuAlt2, HiOutlineFire, HiOutlineCode } from "react-icons/hi";
import Head from "next/head";

export default function Render({ user, cards, error }) {
    const items = [
        {
            name: '<i class="fas fa-house-chimney"></i>Home',
            type: "link",
            href: "#home",
        },
        {
            name: '<i class="fas fa-lightbulb"></i>Features',
            type: "link",
            href: "#features",
        },
        {
            name: '<i class="fas fa-handshake"></i>Reviews',
            type: "link",
            href: "#reviews",
        },
        {
            name: '<i class="fas fa-circle-plus"></i>More',
            type: "dropdown",
            items: [
                {
                    name: '<i class="fas fa-sliders"></i>Dashboard',
                    type: "link",
                    href: "https://www.sparkv.tk/dashboard",
                },
                {
                    name: '<i class="fas fa-book"></i>Docs',
                    type: "link",
                    href: "https://docs.sparkv.tk/",
                },
                {
                    name: '<i class="fas fa-circle-question"></i>Support',
                    type: "link",
                    href: "https://www.sparkv.tk/support",
                },
                {
                    name: '<i class="fas fa-circle-exclamation"></i>Status',
                    type: "link",
                    href: "https://status.sparkv.tk/",
                },
            ],
        },
    ];

    return (
        <>
            <Head><Header name={config.meta.name} description={config.meta.description} logo="https://www.sparkv.tk/assets/images/SparkV.png"></Header></Head>
            <body>
                <div id="load" style={{ display: "flex", height: "100%", width: "100%", alignItems: "center", justifyContent: "center", position: "fixed", zIndex: "9999", backgroundColor: "var(--sparkv-dark)" }}>
                    <div className="">
                        <div className="dots" style={{ eight: "100%", width: "100%", textAlign: "center" }}>
                            <span id="dot" style={{ width: "25px", height: "25px", margin: "0 5px", borderRadius: "50%", display: "inline-block", backgroundColor: "var(--sparkv-yellow)" }}></span>
                            <span id="dot" style={{ width: "25px", height: "25px", margin: "0 5px", borderRadius: "50%", display: "inline-block", backgroundColor: "var(--sparkv-yellow)" }}></span>
                            <span id="dot" style={{ width: "25px", height: "25px", margin: "0 5px", borderRadius: "50%", display: "inline-block", backgroundColor: "var(--sparkv-yellow)" }}></span>
                        </div>
                    </div>
                </div>

                <section className="container-md">
                    <Navbar title="SparkV" logo="/images/SparkV.webp" items={items} />
                    <Hero name="SparkV" description="Powerful, Modern, SparkV. A multipurpose bot with Music, Memes, AI Chatbot, Currency, Leveling, Utility, a dashboard, and more." banner="images/features/hero_banner.webp" logo="/images/SparkV.webp" items={items} />
                    <Hero name="SparkV" description="Powerful, Modern, SparkV. A multipurpose bot with Music, Memes, AI Chatbot, Currency, Leveling, Utility, a dashboard, and more." banner="images/features/hero_banner.webp" logo="/images/SparkV.webp" items={items} />
                </section>

                <Script src="https://code.jquery.com/jquery.js"></Script>
                <Script src="https://cdn.jsdelivr.net/npm/bootstrap/dist/js/bootstrap.min.js"></Script>
                <Script src="https://cdn.jsdelivr.net/gh/cferdinandi/smooth-scroll/dist/smooth-scroll.polyfills.min.js"></Script>
                <Script src="https://cdn.jsdelivr.net/npm/aos/dist/aos.js"></Script>
                <Script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></Script>

                <Script src="/js/handle.js"></Script>
            </body>
        </>
    );
}
