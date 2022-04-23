import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import config from '../config';

import style from "../styles/navbar.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faHouseChimney, faLightbulb, faHandshake, faPlusCircle, faPlus, faSliders, faBook, faCircleQuestion, faCircleExclamation, faUser, faSignOut } from "@fortawesome/free-solid-svg-icons";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";

const items = [
  {
    name: "Home",
    image: <FontAwesomeIcon icon={faHouseChimney} />,
    href: "/",
  },
  {
    name: "Commands",
    image: <FontAwesomeIcon icon={faLightbulb} />,
    href: "/commands",
  },
  {
    name: "Status",
    image: <FontAwesomeIcon icon={faHandshake} />,
    href: "/status",
  },
  {
    name: "More",
    image: <FontAwesomeIcon icon={faPlusCircle} />,
    type: "dropdown",
    items: [
      {
        name: "Dashboard",
        image: <FontAwesomeIcon icon={faSliders} />,
        href: "https://www.sparkv.tk/dashboard"
      },
      {
        name: "Docs",
        image: <FontAwesomeIcon icon={faBook} />,
        href: "https://docs.sparkv.tk/"
      },
      {
        name: "Support",
        image: <FontAwesomeIcon icon={faCircleQuestion} />,
        href: "https://www.sparkv.tk/support"
      },
      {
        name: "Status",
        image: <FontAwesomeIcon icon={faCircleExclamation} />,
        href: "https://status.sparkv.tk/"
      },
    ],
  },
];

export default class Navbar extends React.Component {
  componentDidMount() {
    function changeCss() {
      const navbar = document.querySelector("nav");

      if (this.scrollY >= 50) {
        navbar.classList.remove(style["navbar-no-scroll"]);
        navbar.classList.add(style["navbar-scroll"]);
      } else {
        navbar.classList.remove(style["navbar-scroll"]);
        navbar.classList.add(style["navbar-no-scroll"]);
      }
    }

    window.addEventListener("scroll", changeCss, { passive: true });
  }

  render() {
    const { title, logo, user } = this.props;

    return (
      <nav className="navbar navbar-expand-lg navbar-dark navbar-no-scroll" style={{ padding: "5px", position: "sticky", top: "1rem", zIndex: "100", transition: "all 0.4s ease 0s" }}>
        <div className="container">
          <Link href="/">
            <a className="navbar-brand" style={{ fontFamily: "\'Poppins\', sans-serif", fontWeight: "700" }}>
              <img src={logo} width="38" height="38" style={{ borderRadius: "1.5rem", marginInlineEnd: "6px" }} alt={`${title} logo`} />
              {title}
            </a>
          </Link>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
            aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <FontAwesomeIcon icon={faBars} />
          </button>

          <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
            <div className="mx-auto">
              <ul className="navbar-nav">
                {items.map(item => (
                  <>
                    {item?.type === "dropdown" ? (
                      <li className="nav-item dropdown">
                        <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">{item.image} {item.name}</a>
                        <ul className="dropdown-menu" aria-labelledby="navbarDropdown" style={{ backgroundColor: "var(--sparkv-dark)" }}>
                          {item.items.map(dropItem => (
                            <li>
                              <Link href={dropItem.href}><a className="dropdown-item">{dropItem.image} {dropItem.name}</a></Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ) : (
                      <li className="nav-item">
                        <Link href={item.href}><a className="nav-link" aria-current="page">{item.image} {item.name}</a></Link>
                      </li>
                    )}
                  </>
                ))}
              </ul>
            </div>

            {/* {user?.user ? (
              <div className="dropdown user-dropdown my-menu">
                <button className="btn dropdown-toggle px-2 text-white" style={{ textTransform: "none" }} type="button" id="dropdown_user" data-bs-toggle="dropdown" aria-expanded="false">
                  <span>
                    <img src={`https://cdn.discordapp.com/avatars/${user.user.id}/${user.user.avatar}.webp`} height="38" width="38" style={{ marginRight: "5px", borderRadius: "8px" }} className="rounded" alt="Profile Icon" />
                  </span>
                  <p style={{ alignSelf: "center", fontSize: "16px", fontWeight: "600", marginBottom: "0" }}>
                    <span>{user.user.username}</span>
                    <small style={{ color: "grey", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif" }}>{`#${user.user.discriminator}`}</small>
                  </p>
                </button>

                <ul className="dropdown-menu" aria-labelledby="dropdown_user" style={{ backgroundColor: "var(--sparkv-dark)" }}>
                  <div className="dropdown-item">
                    <Link href="/user">
                      <a><FontAwesomeIcon icon={faUser} size={"lg"} />Profile</a>
                    </Link>
                  </div>

                  <div className="dropdown-item">
                    <Link href="/dashboard">
                      <a className="dropdown-item text-wrap text-white text-center text-wrap fw-bold"><i className="fas fa-cogs"></i>Dashboard</a>
                    </Link>
                  </div>

                  <div className="dropdown-item">
                    <Link href="/api/auth/logout">
                      <a style={{ color: "red" }}><i className="fas fa-sign-out-alt"></i>Log Out</a>
                    </Link>
                  </div>
                </ul>
              </div>
            ) : (
              <button className="btn btn-primary btn-rounded" onClick={() => window.location.href = "/api/auth/login"}>
                <FontAwesomeIcon icon={faDiscord} size={"lg"} />
                <span style={{ marginInlineStart: "4px" }}>Login</span>
              </button>
            )} */}

              <button className="btn btn-primary btn-rounded" onClick={() => window.location.href = "/invite"}>
                <FontAwesomeIcon icon={faDiscord} size={"lg"} />
                <span style={{ marginInlineStart: "4px" }}>Invite</span>
              </button>
          </div>
        </div>
      </nav>
    );
  }
}