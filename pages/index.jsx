import React from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";

import config from "../config";

import hero from "../styles/hero.module.css";
import footer from "../styles/footer.module.css";

import Loader from "../components/loader";
import Header from "../components/head";
import Navbar from "../components/navbar";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp } from "@fortawesome/free-solid-svg-icons";

// import dbConnect from "../old/dbConnect";

export default function Render() {
    return (
        <>
            <Head>
                <Header name={config.meta.name} description={config.meta.description} logo="https://www.sparkv.tk/assets/images/SparkV.png" />
            </Head>
            <body>
                {/* Background */}
                <div className="position-fixed w-100 h-100" style={{ zIndex: "-1" }}>
                    <img defer className="w-100 h-100" src="/images/blobs.svg" alt="Cool Blob Background" style={{ opacity: ".4", WebkitMaskImage: "linear-gradient(to top, transparent 0%, #fff 100%)", objectFit: "cover" }} />
                </div>

                {/* Content */}
                <section className="container-md">
                    <Navbar title="SparkV" logo="/images/SparkV.webp" />

                    <section id="home" style={{ paddingTop: "5rem", paddingBottom: "10rem" }}>
                        <div className="container pb-5">
                            <div className="row align-items-center text-white">
                                <div className="col-md-6 text-start">
                                    <h1 className="display-2_title" style={{ width: "100%", textAlign: "center", fontSize: "xxx-large" }}>
                                        SparkV
                                    </h1>
                                    <p style={{ color: "#fff9", fontSize: "20px", fontFamily: "Satoshi-Regular, sans-serif", textAlign: "center" }}>Powerful, Modern, SparkV. A multipurpose bot with Music, Memes, AI Chatbot, Currency, Leveling, Utility, a dashboard, and more.</p>
                                    <div className="row justify-content-center" style={{ display: "flex", height: "100px", marginTop: "32px" }}>
                                        <Link href="/dashboard">
                                            <a type="button" className="col-5 btn btn-info text-white fw-bold" style={{ height: "56px", marginInlineEnd: "16px", borderRadius: "8px" }}>
                                                Invite SparkV
                                            </a>
                                        </Link>
                                        <Link href="#features">
                                            <a type="button" className="col-5 btn btn-gray text-white fw-bold" style={{ height: "56px", marginInlineEnd: "16px", borderRadius: "8px" }}>
                                                Learn More
                                            </a>
                                        </Link>
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
                                        {config.servers?.map((s) => (
                                            <>
                                                <a key={s.name} href={s.Link} style={{ marginInlineEnd: "10px" }}>
                                                    <Image defer className="animate__animated animate__fadeInUp" src={s.icon} alt={s.name} title={s.name} style={{ borderRadius: "10px" }} height="60" width="60" />
                                                </a>
                                            </>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section id="features" style={{ paddingBottom: "12rem" }}>
                        <h1 className="text-center text-white" style={{ fontWeight: "600" }}>
                            Why use SparkV?
                        </h1>
                        <p className="text-center" style={{ color: "#fff9", fontSize: "20px", fontFamily: "Satoshi-Regular, sans-serif", textAlign: "center" }}>
                            SparkV is loved by more than <strong>157,000</strong> users as an outstanding bot with <a className="gr-blue">Music</a>, <a className="gr-yellow">Memes</a>, <a className="gr-yellow">Money</a>, and more.
                        </p>
                        {config.features.map((f) => (
                            <div key={f.alt} className="row flex-lg-row-reverse align-items-center g-5 py-5 px-5 aos-init" data-aos="zoom-in">
                                {f.align === "left" ? (
                                    <>
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
                                    </>
                                ) : (
                                    <>
                                        <div className="col-lg-6">
                                            <h1 className="display-5 text-white fw-bold lh-1 mb-3" data-aos="fade-up">
                                                {f.title}
                                            </h1>
                                            <p style={{ color: "#fff9", fontSize: "20px", fontFamily: "Satoshi-Regular, sans-serif" }} data-aos="fade-up">
                                                {f.description}
                                            </p>
                                        </div>
                                        <div className="col-12 col-sm-8 col-lg-6">
                                            <img defer data-aos="fade-up" src={f.icon} className="w-100 mx-lg-auto img-fluid aos-init aos-animate" alt={f.alt} style={{ borderRadius: "6px", maxWidth: "400px" }} />
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </section>

                    {/* Reviews */}
                    <section id="reviews" style={{ paddingBottom: "18rem", background: "transparent" }}>
                        <div className="row text-center text-white">
                            <h1 data-aos="fade-up" className="display-3 fw-bold aos-init aos-animate">
                                Reviews
                            </h1>
                            <hr data-aos="fade-up" className="mx-auto aos-init aos-animate" style={{ color: "var(--sparkv-color-2)" }} />
                        </div>
                        <div className="row justify-content-center text-center pb-5 mx-auto">
                            {config.reviews.map((r) => (
                                <div key={r.username} className="col-5 m-3 text-center aos-init aos-animate" style={{ borderRadius: "6px", background: "#111b35", width: "400px", borderLeft: "solid #fff 0.3rem", padding: "15px 15px 0px 15px" }} data-aos="fade-up">
                                    <div style={{ display: "flex", alignItems: "center", color: "rgb(255, 255, 255)", fontSize: "18px", fontWeight: "600", textAlign: "start" }}>
                                        <Image defer height="28" width="28" style={{ borderRadius: "50%", marginInlineEnd: "4px" }} src={r.picture} alt={`${r.username}"s Review`} />
                                        <span style={{ verticalAlign: "middle" }}>{r.username}</span>
                                    </div>
                                    <p style={{ position: "absolute", marginTop: "8px", color: "rgb(209 213 219 / 0.8)" }}>{r.review}</p>
                                    <p style={{ color: "rgb(209 213 219 / 0.8)", textAlign: "end", marginInlineEnd: "10px", marginTop: "86px" }}>{r.role}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </section>

                {/* Footer */}
                <footer className="footer">
                    <div className="container mt-5">
                        <div className="row text-white justify-content-center mt-3 pb-3">
                            {/* As seen on */}
                            <div className="col-12 col-sm-6 col-lg-2 mb-4 mx-auto">
                                <h5 className="text-capitalize fw-bold">As Seen On...</h5>
                                <hr className="bg-white d-inline-block mb-4" style={{ width: "60px", height: "2px" }} />
                                <ul className="list-inline campany-list">
                                    <li>
                                        <a href="https://top.gg/bot/884525761694933073">Top.gg</a>
                                    </li>
                                    <li>
                                        <a href="https://discordbotlist.com/bots/sparkv">Discordbotlist.com</a>
                                    </li>
                                    <li>
                                        <a href="https://voidbots.net/bot/884525761694933073">Voidbots.net</a>
                                    </li>
                                    <li>
                                        <a href="https://discord.bots.gg/bots/884525761694933073">Discord.bots.gg</a>
                                    </li>
                                </ul>
                            </div>
                            {/* Legal */}
                            <div className="col-12 col-sm-6 col-lg-2 mb-4 mx-auto">
                                <h5 className="text-capitalize fw-bold">Legal</h5>
                                <hr className="bg-white d-inline-block mb-4" style={{ width: "60px", height: "2px" }} />
                                <ul className="list-inline campany-list">
                                    <li>
                                        <Link href="/tos">Terms of Service</Link>
                                    </li>
                                    <li>
                                        <Link href="/privacy">Privacy Policy</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <hr style={{ color: "gray" }} />
                        <div className="py-4 text-center text-white" style={{ display: "flex", justifyContent: "space-between" }}>
                            <div style={{ textAlign: "start" }}>
                                © 2021-2022 <Link href="https://www.sparkv.tk/">SparkV</Link>. Illustrations by <Link href="https://storyset.com/technology">Storyset</Link> and <Link href="https://undraw.co/">Undraw</Link>
                            </div>
                            <div style={{ justifyContent: "space-evenly", display: "flex", width: "100px" }}>
                                {/* <a href="#"><i class="fab fa-facebook"></i></a> */}
                                <Link href="https://twitter.com/Ch1llStudio" passHref>
                                    <i className="fab fa-twitter" style={{ fontSize: "22px" }}></i>
                                </Link>
                                <Link href="https://github.com/Ch1ll-Studio" passHref>
                                    <i className="fab fa-github" style={{ fontSize: "22px" }}></i>
                                </Link>
                                {/* <a href="https://linkedin.com/KingCh1ll"><i class="fab fa-linkedin"></i></a> */}
                                {/* <a href="https://instagram.com/Ch1llStudio"><i class="fab fa-instagram"></i></a> */}
                            </div>
                        </div>
                    </div>
                </footer>

                <Link href="#">
                    <a className="back-to-top shadow btn-secondary rounded-circle" id="back-to-top">
                        <FontAwesomeIcon icon={faAngleUp} size={"lg"} />
                    </a>
                </Link>
            </body>
        </>
    );
}

// Render.getInitialProps = async ({ req, res }) => {
//     if (req?.cookies?.__SparkVSession) {
//         const user = await fetch(`${req.headers['x-forwarded-proto'] || 'http'}://${req.headers.host}/api/user?id=${req.cookies.__SparkVSession}`).then(res => res.json());

//         if (user?.success === true) return {
//             user: {
//                 id: user.user.id,
//                 username: user.user.username,
//                 discriminator: user.user.discriminator,
//                 accessToken: user.user.accessToken,
//                 avatar: user.user.avatar,
//                 banner: user.user.banner,
//                 guilds: user.user.guilds
//             }
//         };

//         return {
//             user: null
//         };
//     } else {
//         return {
//             user: null
//         };
//     }
// };
