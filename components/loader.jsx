import React from "react";
import Link from "next/link";
import Image from "next/image";

import config from "../config";

import loader from "../styles/loader.module.scss";

export default class Loader extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true
        };
    }

    componentDidMount() {
        window.onload = (event) => this.setState({ loading: false });
    }

    render() {
        return (
            <div id="load" className={`d-${this.state.loading === false ? "none" : "flex"}`} style={{height: "100%", width: "100%", alignItems: "center", justifyContent: "center", position: "fixed", zIndex: "9999", backgroundColor: "var(--sparkv-dark)" }}>
                <div className="container-md">
                    <div className={loader.dots} style={{ height: "100%", width: "100%", textAlign: "center" }}>
                        <span id="dot" style={{ width: "25px", height: "25px", margin: "0 5px", borderRadius: "50%", display: "inline-block", backgroundColor: "var(--sparkv-yellow)" }}></span>
                        <span id="dot" style={{ width: "25px", height: "25px", margin: "0 5px", borderRadius: "50%", display: "inline-block", backgroundColor: "var(--sparkv-yellow)" }}></span>
                        <span id="dot" style={{ width: "25px", height: "25px", margin: "0 5px", borderRadius: "50%", display: "inline-block", backgroundColor: "var(--sparkv-yellow)" }}></span>
                    </div>
                </div>
            </div>
        )
    }
}