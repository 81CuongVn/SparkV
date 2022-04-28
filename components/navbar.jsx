import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import config from '../config';

import style from "../styles/navbar.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faHouseChimney, faLightbulb, faHandshake, faPlusCircle, faPlus, faSliders, faBook, faCircleQuestion, faCircleExclamation, faUser, faSignOut, faTrafficLight, faIdCard, faRadio } from "@fortawesome/free-solid-svg-icons";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";

const items = [
  {
    name: "Home",
    image: <FontAwesomeIcon icon={faHouseChimney} />,
    href: "/",
  },
  {
    name: "Commands",
    image: <FontAwesomeIcon icon={faBook} />,
    href: "/commands",
  },
  {
    name: "Status",
    image: <FontAwesomeIcon icon={faTrafficLight} />,
    href: "/status",
  },
  {
    name: "Features",
    image: <FontAwesomeIcon icon={faLightbulb} />,
    type: "dropdown",
    items: [
      {
        name: "Music",
        image: <FontAwesomeIcon icon={faRadio} />,
        href: "/music"
      },
      {
        name: "Leveling",
        image: <FontAwesomeIcon icon={faIdCard} />,
        href: "/leveling"
      }
    ]
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
                      <li key={item.name} className="nav-item dropdown">
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
                      <li key={item.name} className="nav-item">
                        <Link href={item.href}><a className="nav-link" aria-current="page">{item.image} {item.name}</a></Link>
                      </li>
                    )}
                  </>
                ))}
              </ul>
            </div>

            <Link href="/invite">
              <a className="button button-blue">Invite</a>
            </Link>
          </div>
        </div>
      </nav>
    );
  }
}