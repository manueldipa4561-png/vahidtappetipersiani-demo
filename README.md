# Vahid Tappeti Rari — Premium Demo

Demo website concept for **Vahid Tappeti Rari**, researched from the current public website and redesigned by Punto Due Studio as a real-client proposal.

## Included

- Premium editorial visual system built around rare Persian/oriental rugs.
- Current business positioning and contact information retained.
- Real featured product: **Kars Sewan anatolico vecchia manifattura cod. D 192** — €1,700, 190 × 141 cm.
- Custom Higgsfield imagery for the hero, restoration atelier and curated collection.
- Responsive desktop/mobile implementation.
- Scroll-reveal and subtle cinematic motion.
- Functional cart drawer with quantity controls and localStorage persistence.
- Full checkout **simulation** with customer fields, payment UI and success state.
- No real payment is processed and no payment data is transmitted.

## Stack

Static HTML/CSS/JavaScript, intentionally dependency-light and suitable for Netlify or any static host.

## Files

- `index.html` — structure and client content
- `styles.css` — visual system, responsive layout and motion
- `script.js` — cart, mobile nav, localStorage, checkout simulation and reveal interactions
- `MASTER_PROMPT.md` — full coordinated TinyFish → Figma → Higgsfield → GitHub workflow brief

## Run locally

```bash
python -m http.server 8080
```

Open `http://localhost:8080`.

## Production note

The checkout is deliberately simulated. A production implementation should connect the approved catalog and inventory to WooCommerce/Stripe/PayPal or the client's chosen payment stack, with proper server-side validation, privacy/cookie compliance and transaction handling.
