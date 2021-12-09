/*
KingCh1ll
Handle.js
*/

let scroll = new SmoothScroll('a[href*="#"]');
let online = true;

$(window).on("load", async () => {
  let Popup = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: popup => {
      popup.addEventListener("mouseenter", Swal.stopTimer);
      popup.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  window.addEventListener("error", err => {
    Popup.fire({
      icon: "error",
      title: "Uh oh!",
      text: `An error occured. Please contact a support member with the following error. ${err.message}`,
    });
  });

  let iframes = document.getElementsByTagName("iframe");

  for (let iframe of iframes) {
    iframe.setAttribute("sandbox", "allow-popups allow-forms");
  }
});

$(document).ready(() => {
  let scrollSpy = new bootstrap.ScrollSpy(document.body, {
    target: "#navbar-example",
  });

  let dataSpyList = [].slice.call(document.querySelectorAll('[data-bs-spy="scroll"]'));
  dataSpyList.forEach(dataSpyEl => {
    bootstrap.ScrollSpy.getInstance(dataSpyEl).refresh();
  });

  let iframes = document.getElementsByTagName("iframe");

  for (let iframe of iframes) {
    iframe.setAttribute("sandbox", "allow-popups allow-forms");
  }

  AOS.init({
    once: false,
    startEvent: "load",
    duration: "600",
  });

  console.log("%cWHOA THERE!", "color: #314ef5; font-weight: bold;; font-size: 50px");
  console.log("%cIf someone told you to paste something here, it's VERY likely you're being scammed.", "color: white; font-size: 20px");
  console.log("%cPasting something here could give hackers access to your account!", "color: red; font-size: 25px");
});
