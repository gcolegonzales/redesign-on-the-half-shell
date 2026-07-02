/* On The Half Shell — redesign concept interactions */
(function () {
  "use strict";

  /* ---- Sticky header shrink-on-scroll ---- */
  var header = document.getElementById("site-header");
  var onScroll = function () {
    if (window.scrollY > 20) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- Mobile nav ---- */
  var toggle = document.getElementById("nav-toggle");
  var menu = document.getElementById("nav-menu");
  var setOpen = function (open) {
    menu.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.style.overflow = open ? "hidden" : "";
  };
  toggle.addEventListener("click", function () {
    setOpen(!menu.classList.contains("open"));
  });
  menu.addEventListener("click", function (e) {
    if (e.target.closest("a")) setOpen(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setOpen(false);
  });
  document.addEventListener("click", function (e) {
    if (
      menu.classList.contains("open") &&
      !e.target.closest("#nav-menu") &&
      !e.target.closest("#nav-toggle")
    ) {
      setOpen(false);
    }
  });

  /* ---- Scroll reveal ---- */
  var reveals = document.querySelectorAll(".reveal");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach(function (el) {
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) {
      el.classList.add("in");
    });
  }

  /* ---- Reservation date min = today ---- */
  var dateInput = document.getElementById("r-date");
  if (dateInput) {
    dateInput.min = new Date().toISOString().split("T")[0];
  }

  /* ---- Reservation request form (concept demo, not wired) ---- */
  var form = document.getElementById("reserve-form");
  var status = document.getElementById("reserve-status");
  if (form && status) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var nameField = form.querySelector('input[name="name"]');
      var first = ((nameField && nameField.value) || "").trim().split(" ")[0];
      status.textContent =
        (first ? "Thanks, " + first + "! " : "Thanks! ") +
        "This is a concept demo — the live version would send your request to the restaurant. For now, please call (225) 673-1951 to confirm.";
      form.querySelectorAll("input, select, button").forEach(function (el) {
        el.setAttribute("disabled", "disabled");
      });
    });
  }

  /* ---- Footer year ---- */
  var yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();
})();
