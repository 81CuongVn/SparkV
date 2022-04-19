/* KingCh1ll */
/* 2/17/2022 */

const maxLengthConfig = {
  alwaysShow: true,
  warningClass: "alert alert-warning",
  limitReachedClass: "alert alert-danger",
}

let scroll = new SmoothScroll('a[href*="#"]');

$(window).on("load", async () => {
  const Popup = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3 * 1000,
    timerProgressBar: true,
    didOpen: (popup) => {
      popup.addEventListener("mouseenter", Swal.stopTimer);
      popup.addEventListener("mouseleave", Swal.resumeTimer);
    },
    showClass: {
      popup: "animate__animated animate__fadeInDown",
    },
    hideClass: {
      popup: "animate__animated animate__fadeOutUp",
    },
  });

  function updateStatus() {
    if (navigator.onLine === true) {
      Popup.fire({
        icon: "success",
        title: "Back Online",
        text: `You're back online!`,
      });
    } else {
      Popup.fire({
        icon: "error",
        title: "Uh oh!",
        text: `You're offline!`,
      });
    }
  }

  window.addEventListener("online", updateStatus);
  window.addEventListener("offline", updateStatus);

  window.addEventListener("error", (err) => {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: err.message,
      footer: "<a href=\"/support\">Contact Support</a>"
    })
  });

  let iframes = document.getElementsByTagName("iframe");

  for (let iframe of iframes) {
    iframe.setAttribute("sandbox", "allow-popups allow-forms");
  }
});

$(document).ready(() => {
  $('textarea.textarea').maxlength(maxLengthConfig);
  $('input.input').maxlength(maxLengthConfig);

  let iframes = document.getElementsByTagName("iframe");

  for (let iframe of iframes) {
    iframe.setAttribute("sandbox", "allow-popups allow-forms");
  }

  AOS.init({
    // once: false,
    duration: "600",
  });

  $(document).on("scroll", () => {
    const scrollDistance = $(this).scrollTop();
    
    if (scrollDistance > 50) {
      $(".navbar").removeClass("navbar-no-scroll").addClass("navbar-scroll");
    } else {
      $(".navbar").removeClass("navbar-scroll").addClass("navbar-no-scroll");
    }
  });

  console.log(
    "%cWHOA THERE!",
    "color: #314ef5; font-weight: bold;; font-size: 50px"
  );
  console.log(
    "%cIf someone told you to paste something here, it's VERY likely you're being scammed.",
    "color: white; font-size: 20px"
  );
  console.log(
    "%cPasting something here could give hackers access to your account!",
    "color: red; font-size: 25px"
  );

  $("#load").fadeOut()
});
