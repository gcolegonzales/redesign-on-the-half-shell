/* On The Half Shell — redesign concept interactions */
(function () {
  "use strict";

  /* ---- Mobile nav ---- */
  var header = document.getElementById("site-header");
  var toggle = document.getElementById("nav-toggle");
  var menu = document.getElementById("nav-menu");
  var drawer = document.getElementById("nav-drawer");
  var scrim = document.getElementById("nav-scrim");
  var isOpen = function () {
    return drawer.classList.contains("open");
  };
  var setOpen = function (open) {
    drawer.classList.toggle("open", open);
    menu.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.style.overflow = open ? "hidden" : "";
    // Keep the header visible while the menu is open
    header.classList.toggle("nav-open", open);
    if (open) header.classList.remove("header-hidden");
  };
  toggle.addEventListener("click", function () {
    setOpen(!isOpen());
  });
  menu.addEventListener("click", function (e) {
    if (e.target.closest("a")) setOpen(false);
  });
  if (scrim) {
    scrim.addEventListener("click", function () {
      setOpen(false);
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setOpen(false);
  });

  /* ---- Sticky header: shrink + hide on scroll-down / reveal on scroll-up ---- */
  var lastY = window.scrollY;
  var onScroll = function () {
    var y = window.scrollY;
    if (y > 20) header.classList.add("scrolled");
    else header.classList.remove("scrolled");

    if (!isOpen()) {
      if (y > lastY && y > 120) {
        // scrolling down, past the header
        header.classList.add("header-hidden");
      } else if (y < lastY) {
        // any upward scroll reveals immediately
        header.classList.remove("header-hidden");
      }
    }
    lastY = y;
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

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
