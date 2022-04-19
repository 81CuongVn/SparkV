import Link from 'next/link';
import Image from 'next/image';
import config from '../config';

export default function Features({ name, features }) {
  return (
    <section id="features" style={{ paddingBottom: "12rem" }}>
      <h1 class="text-center text-white" style={{ fontWeight: "600;" }}>Why use {name}?</h1>
      <p class="text-center" style="color: #fff9;font-size: 20px;font-family: Satoshi-Regular, sans-serif;text-align: center;">SparkV is loved by more than <strong>157,000</strong> users as an outstanding bot with <a class="gr-blue">Music</a>, <a class="gr-yellow">Memes</a>, <a class="gr-yellow">Money</a>, and more.</p>
      {features.forEach(f => {
        if (f.align === "left") {
          <div class="row flex-lg-row-reverse align-items-center g-5 py-5 px-5 aos-init" data-aos="zoom-in">
            <div class="col-12 col-sm-8 col-lg-6">
              <img defer data-aos="fade-up" src="<%- f.icon %>" class="w-100 mx-lg-auto img-fluid aos-init aos-animate"
          alt="<%- f.alt %>" style="border-radius:6px;max-width: 400px;">
            </div>
            <div class="col-lg-6">
              <h1 class="display-5 text-white fw-bold lh-1 mb-3" data-aos="fade-up">{f.title}</h1>
              <p style="color: #fff9;font-size: 20px;font-family: Satoshi-Regular, sans-serif;" data-aos="fade-up">{f.description}</p>
            </div>
          </div>
        } else if (f.align === "right") {
          <div class="row flex-lg-row-reverse align-items-center g-5 py-5 px-5 aos-init" data-aos="zoom-in">
            <div class="col-lg-6">
              <h1 class="display-5 text-white fw-bold lh-1 mb-3" data-aos="fade-up"><%- f.title %></h1>
              <p style="color: #fff9;font-size: 20px;font-family: Satoshi-Regular, sans-serif;" data-aos="fade-up"><%- f.description %></p>
            </div>
            <div class="col-12 col-sm-8 col-lg-6">
              <img defer data-aos="fade-up" src="<%- f.icon %>" class="w-100 mx-lg-auto img-fluid aos-init aos-animate"
          alt="<%- f.alt %>" style="max-width: 400px;border-radius:6px;">
            </div>
          </div>
        <% } %>
      <% }); %>
    </section>

  );
}