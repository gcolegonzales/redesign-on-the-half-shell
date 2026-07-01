/* On The Half Shell — redesign concept interactions */
(function () {
  "use strict";

  /* ---- Sticky header shrink ---- */
  var header = document.getElementById("site-header");
  var onScroll = function () {
    if (window.scrollY > 24) header.classList.add("scrolled");
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

  /* ---- Scroll reveal ---- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
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

  /* ---- Reserve date min = today ---- */
  var dateInput = document.getElementById("r-date");
  if (dateInput) {
    var today = new Date();
    var iso = today.toISOString().split("T")[0];
    dateInput.min = iso;
  }

  /* ---- Non-wired form handling (concept demo) ---- */
  function wireForm(formId, statusId, message) {
    var form = document.getElementById(formId);
    var status = document.getElementById(statusId);
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var name = (form.querySelector('input[name="name"]') || {}).value || "";
      var first = name.trim().split(" ")[0];
      status.textContent = message(first);
      form.querySelectorAll("input, select, button").forEach(function (el) {
        el.setAttribute("disabled", "disabled");
      });
    });
  }

  wireForm("reserve-form", "reserve-status", function (name) {
    return (
      (name ? "Thanks, " + name + "! " : "Thanks! ") +
      "This is a concept demo — in the live version we'd confirm your table here."
    );
  });
  wireForm("event-form", "event-status", function (name) {
    return (
      (name ? "Got it, " + name + "! " : "Got it! ") +
      "Concept demo — the live version would route your inquiry to the events team."
    );
  });

  /* ---- Prevent placeholder links from jumping ---- */
  document.querySelectorAll('a[data-noop]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
    });
  });

  /* ---- Footer year ---- */
  var yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();
})();
