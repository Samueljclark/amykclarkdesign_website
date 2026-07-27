/* Amy K Clark Design - minimal site JS.
   Handles: mobile nav toggle, scrolled-header shadow, current-page nav
   highlighting (so header markup stays identical across all pages),
   the mobile floating CTA, and the portfolio lightbox. No dependencies. */

(function () {
  "use strict";

  /* ---- Current-page nav highlighting ---- */
  var path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-menu a, .footer-inner nav a").forEach(function (link) {
    var href = link.getAttribute("href").split("/").pop();
    if (href === path && !link.classList.contains("button")) {
      link.setAttribute("aria-current", "page");
    }
  });

  /* ---- Mobile nav toggle ---- */
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("nav-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("is-open")) {
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  /* ---- Header shadow + mobile floating CTA on scroll ---- */
  var header = document.querySelector(".site-header");
  var mobileCta = document.querySelector(".mobile-cta");
  var onScroll = function () {
    var y = window.scrollY;
    if (header) header.classList.toggle("is-scrolled", y > 8);
    if (mobileCta) mobileCta.classList.toggle("is-visible", y > 520);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Portfolio lightbox ---- */
  var galleryLinks = document.querySelectorAll(".project-gallery a");
  if (galleryLinks.length) {
    var lightbox = document.createElement("div");
    lightbox.className = "lightbox";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", "Enlarged project photo");
    lightbox.innerHTML =
      '<button class="lightbox-close" aria-label="Close">&times;</button><img src="" alt="">';
    document.body.appendChild(lightbox);

    var lbImg = lightbox.querySelector("img");
    var lbClose = lightbox.querySelector(".lightbox-close");
    var lastFocus = null;

    var openLightbox = function (href, alt) {
      lbImg.src = href;
      lbImg.alt = alt || "";
      lightbox.classList.add("is-open");
      lastFocus = document.activeElement;
      lbClose.focus();
    };
    var closeLightbox = function () {
      lightbox.classList.remove("is-open");
      lbImg.src = "";
      if (lastFocus) lastFocus.focus();
    };

    galleryLinks.forEach(function (link) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        var img = link.querySelector("img");
        openLightbox(link.getAttribute("href"), img ? img.alt : "");
      });
    });
    lbClose.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && lightbox.classList.contains("is-open")) closeLightbox();
    });
  }
})();
