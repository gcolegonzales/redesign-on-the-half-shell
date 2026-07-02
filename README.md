# On The Half Shell — Redesign Concept

A modern, single-page website **redesign concept** for **On The Half Shell**, the oyster bar & seafood restaurant at 37390 Perkins Rd, Prairieville, LA — serving fresh Louisiana seafood with live music for 20+ years.

This is an **unsolicited design concept / pitch**, not the official site.

## Why this redesign

The current site ([onthehalfshell.biz](https://www.onthehalfshell.biz/)) works, but:

- **Visually dated** — a stock template that doesn't reflect a lively, 20-year oyster bar and live-music room.
- **Reservations by phone only** — the current site notes that "reservation and catering information is available by calling." There's no way to request a table online.
- **Menu buried** — the food and prices don't get a confident, editorial presentation.

This concept keeps everything real and adds the key upgrade.

## What's real here

- **Their actual photos.** Hero and gallery use On The Half Shell's own photography, pulled from their live site's image CDN (raw oysters, chargrilled platter, boiled shrimp, oyster po'boy & gumbo, the bar at night, the dining room, live-music). See `assets/photos/`.
- **Their full, real menu with real prices** — raw & chargrilled oysters, appetizers, gumbos, salads, platters, specialties, steaks, burgers & po'boys, "just enough" plates, sides, kids, and desserts.
- **Their real ordering & gift links, preserved as working links:**
  - Order pickup → their **Toast** ordering page
  - Order delivery → their **DoorDash** store
  - Gift cards → their **Toast eGift Cards** page
  - Catering inquiry & full music calendar → their existing pages
- **Real hours** (Sun 10–9, Mon 11–9, Tue–Fri 11–10, Sat 4–10) and **real live-music schedule** (Tue–Sat evenings + Sunday brunch).

## The upgrade

- **Online reservation request** — a real form (name, phone, party size, date, time, notes) that replaces phone-only booking. It is styled and validated but **not yet wired** to a live inbox (marked as a concept demo), so no fake confirmations are implied.

## Design

Distinct coastal oyster-bar direction: **deep navy + oyster cream + warm brass**, matching their real navy logo. Varied editorial layouts — a split raw-bar feature, real menu tables, a full-bleed photo gallery, alternating image/text rows, a quote band — rather than a grid of icon cards. Animated shrink-on-scroll nav, animated underlines, a real mobile menu, and scroll-reveal motion that respects `prefers-reduced-motion`.

## How to view

Open **`index.html`** in any modern browser (double-click it). Fully static: `index.html` + `styles.css` + `script.js` + `assets/`. No build step, no dependencies.

## Notes

- Photos are the business's own, optimized to < 400 KB each for the web.
- The reservation form is the only non-wired element; every order/gift/catering/directions link points to the real destination.
