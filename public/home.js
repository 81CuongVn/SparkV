$(window).on("scroll", function(){
  if ($(window).scrollTop()){
    $("header").addClass("nav-show")
  } else {
    $("header").removeClass("nav-show")
  }
})

$(document).ready(function(){
  console.log("Document loaded.")

  $("a").on("click", function(event){
    if (this.hash !== ""){
      event.preventDefault()
  
      var hash = this.hash
  
      $("html, body").animate({
        scrollTop: $(hash).offset().top
      }, 800, function(){
        window.location.hash = hash
      })
    }
  })
})

const onload = () => {
  const headfade = document.querySelector(".headfade")
  const navbar = document.querySelector(".nav-bar")
  const navlinks = document.querySelectorAll(".nav-bar li")
  console.log(headfade, navbar, navlinks)

  headfade.onclick = () => {
    console.log("Clicked")
    navbar.classList.toggle("nav-active")
    console.log("nav is now active")

    navlinks.forEach((link, index) => {
      console.log(link, index)
      if (link.style.animation){
        link.style.animation = "";
      } else {
        link.style.animation = `navLinkFade 0.5 ease forwards ${index / 8}s`;
    }
  });

  headfade.classList.toggle("toggle")
  }
}

window.onload = () => onload();