import Link from 'next/link';
import Image from 'next/image';
import config from '../config';

import "../styles/footer.module.css";


export default function Navbar({ name, description, banner, servers }) {
  return (
    <section id="home" style={{ paddingTop: "8rem", paddingBottom: "10rem;" }}>
    <div className="container pb-5">
      <div className="row align-items-center text-white">
        <div className="col-md-6 text-start">
          <h1 className="display-2_title" style={{ width: "100%", textAlign: "center", fontSize: "xxx-large;" }}>{name}</h1>
          <p style={{ color: "#fff9", fontSize: "20px", fontFamily: "Satoshi-Regular, sans-serif", textAlign: "center" }}>{description}</p>
          <div className="row justify-content-center" style={{ display: "flex", height: "100px", marginTop: "32px" }}>
            <Link type="button" className="col-5 btn btn-info text-white fw-bold" href="/dashboard" style={{ height: "56px", marginInlineEnd: "16px", borderRadius: "8px;" }}>
              <span>Invite {name}</span>
            </Link>

            <a type="button" className="col-5 btn btn-gray text-white fw-bold" href="#features" style={{ height: "56px", marginInlineEnd: "16px", borderRadius: "8px;" }}>Learn More</a>
          </div>
        </div>

        <div className="col-md-6 text-end">
          <div className="video-box">
            <img defer src={banner} alt="SparkV" className="img-fluid" style={{ borderRadius: "15px" }} draggable="false"/>
          </div>
        </div>
      </div>
    </div>

    <div className="footer-sm" id="companies">
      <div className="container pb-5">
        <div className="row py-4 text-center text-white">
          <h4 className="col-lg-5 col-md-6 mb-4 mb-md-0 animate__animated animate__fadeInUp">Used by Over 200 Servers</h4>
          <div className="col-lg-7 col-md-6">
            {servers?.forEach(s => {
              <a href="<%- s.link %>" style={{ marginInlineEnd: "10px" }}>
                <img defer className="animate__animated animate__fadeInUp" src="<%- s.icon %>" alt="<%- s.name %>" title="<%- s.name %>" style={{ borderRadius: "10px" }} height="60" width="60"/>
              </a>
            })}
          </div>
        </div>
      </div>
    </div>
  </section>
  );
}