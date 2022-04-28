import React from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";

import config from "../config";

import hero from "../styles/hero.module.css";

import Header from "../components/head";
import Navbar from "../components/navbar";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

export default function Render({ commands }) {
    return (
        <>
            <Head>
                <Header name={`Commands - ${config.name}`} description={`View SparkV's many amazing commands. ${config.meta.description}`} logo="https://www.sparkv.tk/assets/images/SparkV.png"></Header>
            </Head>
            <body>
                {/* Content */}
                <section className="container-md">
                    <Navbar title="SparkV" logo="/images/SparkV.webp" />

                    <section id="commands" style={{ width: "100%", height: "100%", display: "flex", marginTop: "125px", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px", textAlign: "center", margin: "7% 0" }}>
                        <div style={{ display: "flex", padding: "12px", width: "100%", maxWidth: "100%" }}>
                            <div className="search input-group flex-nowrap" style={{ backgroundColor: "var(--sparkv-dark-2)", msContentZoomLimitMax: "1px solid var(--sparkv-color)", display: "flex", width: "100%", maxWidth: "100%" }}>
                                <span className="input-group-text" style={{ color: "rgb(255, 255, 255)", background: "inherit", border: "inherit", borderRadius: "8px 0px 0px 8px" }} id="commands">
                                    <FontAwesomeIcon icon={faSearch} />
                                </span>
                                <input
                                    type="text"
                                    id="cmdsSearch"
                                    onKeyUp={() => {
                                        const input = document.getElementById("cmdsSearch");
                                        const table = document.getElementsByClassName("cmdsList");
                                        const commands = document.getElementsByClassName("command");

                                        let i = 0;
                                        for (i = 0; i < commands.length; i++) {
                                            const cmdName = commands[i].getElementsByClassName("cmdName")[0];
                                            const cmdDesc = commands[i].getElementsByClassName("cmdDesc")[0];

                                            if (cmdName) {
                                                if ((cmdName.textContent || cmdName.innerText).toLowerCase().indexOf(input.value.toLowerCase()) > -1) commands[i].style.display = "";
                                                else commands[i].style.display = "none";
                                            }
                                        }
                                    }}
                                    className="form-control"
                                    placeholder="Search for command."
                                    style={{ fontFamily: "Rubik, sans-serif", color: "var(--sparkv-light)", backgroundColor: "inherit", paddingLeft: "2.5em", width: "100%", maxWidth: "100%", border: "inherit", borderRadius: "8px" }}
                                    aria-label="Commands"
                                    aria-describedby="commands"
                                />
                            </div>
                        </div>
                        <div className="container cmdsList" style={{ display: "flex", flexDirection: "column" }}>
                            {Object.entries(commands).map((category) =>
                                category[1].map((command, index) => (
                                    <div className="command m-2" style={{ width: "100%", background: "rgb(0, 10, 35, .3)", borderRadius: "20px", padding: "20px" }}>
                                        <div style={{ fontFamily: "Rubik, sans-serif", marginLeft: "20px" }} className="col">
                                            <h1 className="cmdName" style={{ textAlign: "left", fontSize: "20px", fontWeight: "600", color: "rgb(255, 255, 255)" }}>
                                                /{command?.name} {command?.usage ? command?.usage : ""}
                                            </h1>
                                            <p className="cmdDesc" style={{ width: "100%", fontSize: "15px", textAlign: "left", color: "var(--sparkv-light)" }}>{command?.description || "No description provided."}</p>
                                        </div>
                                    </div>
                                ))
                            )}
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
            </body>
        </>
    );
}

export async function getStaticProps({ req, res }) {
    const commands = await fetch("https://raw.githubusercontent.com/Ch1ll-Studio/SparkV/master/docs/commandsdata.json").then((res) => res.json()).catch((err) => console.error(err));

    return {
        props: { commands: commands ?? [] },
    };
}
