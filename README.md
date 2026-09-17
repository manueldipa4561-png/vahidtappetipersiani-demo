# Vahid Tappeti Rari — Premium Demo

Real-client redesign concept for **Vahid Tappeti Rari**, researched from the current public website and rebuilt by Punto Due Studio as a premium specialist + e-commerce experience.

## Included

- Premium editorial visual system for rare Persian/oriental rugs.
- Existing business positioning, specialist services and contact information retained.
- Dedicated `shop.html` with search, category filters, origin filter, sorting, real source-backed products, quick view, recently viewed products and specialist-advice CTA.
- Real featured products include Kars Sewan D 192 (€1,700), Shirvan D 159 (€4,500), Kilim Bakhtiari G017 (€1,900) and Kashkuli D069 (€1,950).
- Persistent multi-product cart with quantity controls and localStorage.
- Demo shipping logic: local Pescara option, standard Italy shipping, special-care delivery and an oversized/special-handling simulation.
- Full checkout **simulation** with customer fields, shipping selection, payment UI and success state.
- Dedicated `restauro.html` with a five-step service journey, FAQ, estimate CTA, Higgsfield motion, generated process comparison and a separate interactive 3D Jutsu scene.
- Custom Higgsfield imagery for hero, restoration atelier, collection and before/after demonstration.
- Responsive desktop/mobile implementation and reduced-motion support.

## Higgsfield assets

The project uses a deliberately limited generation budget. Existing still assets were retained, then one 6-second restoration animation and one before/after process visual were added. The 3D restoration scene is available separately from the restoration page.

## Shipping disclaimer

Shipping values inside the demo are **illustrative UI behavior**, not an approved commercial tariff from Vahid Tappeti Rari. The current client website promotes free home pickup/delivery; production rules should define the actual service area, national shipping price, insurance, oversized-item handling and carrier conditions.

## Stack

Static HTML/CSS/JavaScript, intentionally dependency-light and suitable for Netlify or another static host.

## Files

- `index.html` — premium homepage and entry points
- `shop.html` — dedicated luxury commerce experience
- `restauro.html` — dedicated washing/restoration process experience
- `styles.css` — shared visual system, responsive layout and motion
- `script.js` — cart, filters, quick view, shipping calculations, localStorage and checkout simulation
- `MASTER_PROMPT.md` — coordinated TinyFish → Figma → Higgsfield → GitHub workflow brief
- `netlify.toml` — static deployment configuration

## Run locally

```bash
python -m http.server 8080
```

Open `http://localhost:8080`.

## Production note

The checkout is deliberately simulated. A production implementation should connect the approved inventory and catalog to WooCommerce, Stripe, PayPal or the client's chosen payment stack, with server-side validation, stock control, verified shipping rules, privacy/cookie compliance, fraud controls and real transaction handling.
