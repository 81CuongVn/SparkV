import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import config from '../config';

import style from "../styles/navbar.module.css";

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
    const { title, logo, user, items } = this.props;

    return (
      <nav className="navbar navbar-expand-lg navbar-dark navbar-no-scroll" style={{ padding: "5px", position: "sticky", top: "1rem", zIndex: "100", transition: "all 0.4s ease 0s" }}>
        <div className="container">
          <div className="navbar-brand" style={{ fontFamily: "\'Poppins\', sans-serif", fontWeight: "700" }} href="/">
            <img src={logo} width="48" height="48" style={{ borderRadius: "1.5rem" }} alt={`${title} logo`} />
            <Link href="/">{title}</Link>
          </div>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
            aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="fas fa-bars"></span>
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
                          <a className="dropdown-item" href={dropItem.href}>{dropItem.image} {dropItem.name}</a>
                        </li>
                      ))}
                    </ul>
                  </li>
                ) : (
                  <li className="nav-item">
                    <a className="nav-link active" aria-current="page" href={item.href}>{item.image} {item.name}</a>
                  </li>
                )}
                </>
              ))}
              </ul>
            </div>

            {user ? (
              <div className="dropdown user-dropdown my-menu">
                <button className="btn dropdown-toggle px-2 text-white" style={{ textTransform: none }} type="button" id="dropdown_user" data-bs-toggle="dropdown" aria-expanded="false">
                  <span>
                    <img src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp`} height="38" width="38" style={{ marginRight: "5px", borderRadius: "8px" }} className="rounded" alt="Profile Icon" />
                  </span>
                  <p style={{ alignSelf: "center", fontSize: "16px", fontWeight: "600", marginBottom: "0" }}>
                    <span>{user.username}</span>
                    <small style="color: grey; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif">#{user.discriminator}</small>
                  </p>
                </button>

                <ul className="dropdown-menu" aria-labelledby="dropdown_user" style={{ backgroundColor: "var(--sparkv-dark)" }}>
                  <div className="dropdown-item">
                    <Link href="/user" passHref>
                      <i className="fas fa-user"></i>
                      Profile
                    </Link>
                  </div>

                  <div className="dropdown-item">
                    <Link href="/dashboard" className="dropdown-item text-wrap text-white text-center text-wrap fw-bold" passHref>
                      <i className="fas fa-cogs"></i>
                      Dashboard
                    </Link>
                  </div>

                  <div className="dropdown-item">
                    <Link href="/api/logout" style={{ color: "red" }} passHref>
                      <i className="fas fa-sign-out-alt"></i>
                      Log Out
                    </Link>
                  </div>
                </ul>
              </div>
            ) : (
              <Link type="button" className="btn btn-primary btn-rounded" href="/api/auth/login" role="button">
                <span><i className="fab fa-discord"></i>Login</span>
              </Link>
            )}
          </div>
        </div>
      </nav>
    );
  }
}