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
  var main = document.getElementById("main");
  var focusables = function () {
    // Toggle stays visible while the drawer is open, so include it in the loop.
    return [toggle].concat(
      Array.prototype.slice.call(
        menu.querySelectorAll("a[href], button:not([disabled])")
      )
    );
  };
  var setOpen = function (open) {
    drawer.classList.toggle("open", open);
    menu.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.style.overflow = open ? "hidden" : "";
    document.documentElement.style.overflow = open ? "hidden" : "";
    // Keep the header visible while the menu is open
    header.classList.toggle("nav-open", open);
    if (open) header.classList.remove("header-hidden");
    // Take the off-canvas links out of the tab order when the drawer is closed
    // so Tab can never reach hidden links.
    menu.querySelectorAll("a[href]").forEach(function (a) {
      if (open) a.removeAttribute("tabindex");
      else a.setAttribute("tabindex", "-1");
    });
    // Make the rest of the page inert to keyboard + AT while the drawer is open.
    if (main) {
      if (open) {
        main.setAttribute("aria-hidden", "true");
        main.setAttribute("inert", "");
      } else {
        main.removeAttribute("aria-hidden");
        main.removeAttribute("inert");
      }
    }
    if (open) {
      // Move focus into the drawer WITHOUT scrolling the page: focus() would
      // otherwise scroll the focused link into view and jump the page to top.
      var first = menu.querySelector("a[href]");
      if (first) first.focus({ preventScroll: true });
    } else {
      // Return focus to the toggle on close (no scroll jump).
      if (typeof toggle.focus === "function") toggle.focus({ preventScroll: true });
    }
  };
  toggle.addEventListener("click", function () {
    setOpen(!isOpen());
  });
  // Trap Tab within the drawer (toggle + menu links) while open.
  drawer.addEventListener("keydown", function (e) {
    if (e.key !== "Tab" || !isOpen()) return;
    var items = focusables();
    if (!items.length) return;
    var firstEl = items[0];
    var lastEl = items[items.length - 1];
    var active = document.activeElement;
    if (e.shiftKey && active === firstEl) {
      e.preventDefault();
      lastEl.focus();
    } else if (!e.shiftKey && active === lastEl) {
      e.preventDefault();
      firstEl.focus();
    }
  });
  // The toggle sits outside the drawer element; keep it inside the trap.
  toggle.addEventListener("keydown", function (e) {
    if (e.key !== "Tab" || !isOpen()) return;
    var items = focusables();
    if (!items.length) return;
    if (e.shiftKey && document.activeElement === items[0]) {
      e.preventDefault();
      items[items.length - 1].focus();
    }
  });
  // Reset drawer + toggle state when crossing the desktop breakpoint.
  var mq = window.matchMedia("(min-width: 901px)");
  var onMq = function () {
    if (mq.matches && isOpen()) setOpen(false);
    else if (mq.matches) {
      // Desktop: ensure drawer links are usable (they're display:none anyway)
      // and no stale state lingers.
      menu.querySelectorAll("a[href]").forEach(function (a) {
        a.removeAttribute("tabindex");
      });
    }
  };
  if (mq.addEventListener) mq.addEventListener("change", onMq);
  else if (mq.addListener) mq.addListener(onMq);
  // Initialize: at mobile widths the drawer starts closed, so pull its links
  // out of the tab order until it's opened.
  if (!mq.matches) {
    menu.querySelectorAll("a[href]").forEach(function (a) {
      a.setAttribute("tabindex", "-1");
    });
  }
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
