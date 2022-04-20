import React from "react";
import { parseCookies } from "nookies";
import socket from "socket.io-client";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";

import config from "../config";

import "../styles/navbar.module.css";
import "../styles/hero.module.css";
import "../styles/loader.module.css";

import Header from "../components/head";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

import { HiOutlineNewspaper, HiOutlineLink, HiX, HiOutlineExclamation, HiOutlineFolder, HiOutlineMenuAlt2, HiOutlineFire, HiOutlineCode } from "react-icons/hi";

export default class Render extends React.Component {
    constructor(props) {
        super(props);

        console.log(this.state);
        this.state = {
            user: null,
        };
    }

    render() {
        const { user } = this.state;
        const { token } = this.props;
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
                name: '',
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

        const servers = [
            {
                name: "Discord Bots",
                icon: "/assets/images/servers/discord_bots.webp",
                link: "https://discord.gg/dbots",
            },
            {
                name: "Homework Help",
                icon: "/assets/images/servers/homework_help.webp",
                link: "https://discord.gg/f835ez9Pqf",
            },
            {
                name: "Void Bots",
                icon: "/assets/images/servers/void_bots.webp",
                link: "https://discord.gg/voidbots",
            },
            {
                name: "Assistants Center",
                icon: "/assets/images/servers/assistants_center.webp",
                link: "https://discord.gg/wgkCKxh3Xx",
            },
        ];

        return (
            <>
                <Head>
                    <Header name={config.meta.name} description={config.meta.description} logo="https://www.sparkv.tk/assets/images/SparkV.png"></Header>
                </Head>
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
                        <section id="home" style={{ paddingTop: "8rem", paddingBottom: "10rem" }}>
                            <div className="container pb-5">
                                <div className="row align-items-center text-white">
                                    <div className="col-md-6 text-start">
                                        <h1 className="display-2_title" style={{ width: "100%", textAlign: "center", fontSize: "xxx-large" }}>SparkV</h1>
                                        <p style={{ color: "#fff9", fontSize: "20px", fontFamily: "Satoshi-Regular, sans-serif", textAlign: "center" }}>Powerful, Modern, SparkV. A multipurpose bot with Music, Memes, AI Chatbot, Currency, Leveling, Utility, a dashboard, and more.</p>
                                        <div className="row justify-content-center" style={{ display: "flex", height: "100px", marginTop: "32px" }}>
                                            <a type="button" className="col-5 btn btn-info text-white fw-bold" href="/dashboard" style={{ height: "56px", marginInlineEnd: "16px", borderRadius: "8px" }}>Invite SparkV</a>
                                            <a type="button" className="col-5 btn btn-gray text-white fw-bold" href="#features" style={{ height: "56px", marginInlineEnd: "16px", borderRadius: "8px" }}>Learn More</a>
                                        </div>
                                    </div>

                                    <div className="col-md-6 text-end">
                                        <div className="video-box">
                                            <img defer src="images/features/hero_banner.webp" alt="SparkV" className="img-fluid" style={{ borderRadius: "15px" }} draggable="false" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="footer-sm" id="companies">
                                <div className="container pb-5">
                                    <div className="row py-4 text-center text-white">
                                        <h4 className="col-lg-5 col-md-6 mb-4 mb-md-0 animate__animated animate__fadeInUp">Used by Over 200 Servers</h4>
                                        <div className="col-lg-7 col-md-6">
                                            {servers?.forEach(s => (
                                                <>
                                                    <a href={s.Link} style={{ marginInlineEnd: "10px" }}>
                                                        <img defer className="animate__animated animate__fadeInUp" src={s.icon} alt={s.name} title={s.name} style={{ borderRadius: "10px" }} height="60" width="60" />
                                                    </a>
                                                </>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <section id="features" style={{ paddingBottom: "12rem" }}>
                            <h1 className="text-center text-white" style={{ fontWeight: "600;" }}>
                                Why use SparkV?
                            </h1>
                            <p className="text-center" style={{ color: "#fff9", fontSize: "20px", fontFamily: "Satoshi-Regular, sans-serif", textAlign: "center" }}>
                                SparkV is loved by more than <strong>157,000</strong> users as an outstanding bot with <a className="gr-blue">Music</a>, <a className="gr-yellow">Memes</a>, <a className="gr-yellow">Money</a>, and more.
                            </p>
                            {config.features.forEach((f) => (
                                <div className="row flex-lg-row-reverse align-items-center g-5 py-5 px-5 aos-init" data-aos="zoom-in">
                                    {/* {f.align === "left" ? 
                                    <> */}
                                    <div className="col-12 col-sm-8 col-lg-6">
                                        <img defer data-aos="fade-up" src={f.icon} className="w-100 mx-lg-auto img-fluid aos-init aos-animate" alt={f.alt} style={{ borderRadius: "6px", maxWidth: "400px" }} />
                                    </div>
                                    <div className="col-lg-6">
                                        <h1 className="display-5 text-white fw-bold lh-1 mb-3" data-aos="fade-up">
                                            {f.title}
                                        </h1>
                                        <p style={{ color: "#fff9", fontSize: "20px", fontFamily: "Satoshi-Regular, sans-serif" }} data-aos="fade-up">
                                            {f.description}
                                        </p>
                                    </div>
                                    {/* </>
                                :
                                    <>
                                        <div className="col-lg-6">
                                            <h1 className="display-5 text-white fw-bold lh-1 mb-3" data-aos="fade-up">{f.title}</h1>
                                            <p style="color: #fff9;font-size: 20px;font-family: Satoshi-Regular, sans-serif;" data-aos="fade-up">{f.description}</p>
                                        </div>
                                        <div className="col-12 col-sm-8 col-lg-6">
                                            <img defer data-aos="fade-up" src={f.icon} className="w-100 mx-lg-auto img-fluid aos-init aos-animate"
                                                alt="<%- f.alt %>" style="max-width: 400px;border-radius:6px;" />
                                        </div>
                                    </> */}
                                    ))}
                                </div>
                            ))}
                        </section>
                        {/* <Footer name="SparkV" description="Powerful, Modern, SparkV. A multipurpose bot with Music, Memes, AI Chatbot, Currency, Leveling, Utility, a dashboard, and more." banner="images/features/hero_banner.webp" logo="/images/SparkV.webp" items={items} /> */}
                    </section>

                    <Script
                        src="https://code.jquery.com/jquery.js"
                        onLoad={() => {
                            <Script src="/js/handle.js"></Script>
                        }}
                    ></Script>
                    <Script src="https://cdn.jsdelivr.net/npm/bootstrap/dist/js/bootstrap.min.js" strategy="lazyOnload"></Script>
                    <Script src="https://cdn.jsdelivr.net/gh/cferdinandi/smooth-scroll/dist/smooth-scroll.polyfills.min.js"></Script>
                    <Script src="https://cdn.jsdelivr.net/npm/aos/dist/aos.js"></Script>
                </body>
            </>
        );
    }
}

export const getServerSideProps = async (data) => {
    const { ["__SparkVSession"]: token = null } = parseCookies(data);

    return {
        props: {
            token,
            hostApi: config.api,
        },
    };
}