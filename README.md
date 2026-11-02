# My Telstra · Telstra Plus — Dynamic Yield Demo

A high-fidelity, clickable prototype of the **Telstra Plus** section of the **My Telstra** app, personalised by **Dynamic Yield** with a conversational **Telstra Plus assistant** powered by **Shopping Muse**.

It reuses the architecture, interaction model and presenter tooling of the [MTN MoMo](https://github.com/jlin92/mtn-momo-dy) and [Rakuten](https://github.com/chris9689/rakuten-loyalty) prototypes (React + TypeScript + Vite + Tailwind + framer-motion, iPhone frame, chapter-based `DemoContext`, persona-aware mock data, hidden presenter rail, "Why shown now" panel), re-skinned to the live My Telstra app. Brand tokens were sampled from Telstra's official App Store / Google Play screenshots (Telstra blue `#0D54FF`, navy `#1A2E61`, page grey `#F4F4F4`), and the screens follow the live app's patterns: blue header with "G'day, {name}", the white tier card ("Gold · 208,090 pts >"), flat white list rows with chevrons, segmented pills, and the five-tab bottom nav (Home · Services · Payments · Get help · Shop).

All balances, tiers, rewards, points prices and offers are illustrative and for demonstration only.

## Run locally

Requires Node 22.12+.

```bash
npm install
npm run dev
```

Open the local URL shown by Vite (default: http://localhost:5173/).

> On a corporate network with a TLS-inspecting proxy, point Node at your system trust store, e.g. `export NODE_EXTRA_CA_CERTS=/path/to/corp-ca.pem` before `npm install`. If your system Node is older, `npx --package=node@22 --package=npm@10 -c 'npm run dev'` runs it without changing your global install.

## Build check

```bash
npm run build   # tsc -b && vite build
```

## Demo flows

See **[DEMO_FLOWS.md](DEMO_FLOWS.md)** for the step-by-step presenter script for both personas and the side-by-side comparison of what each sees on every screen.

## App structure

Only Telstra Plus is built out. The My Telstra bottom nav is present for context: **Home** covers the hub, Earn and Benefits; **Shop** opens the Rewards Store and stays highlighted on the store, reward and bag screens. Services / Payments / Get help show a short toast.

| # | Screen | What's personalised |
|---|--------|---------------------|
| 1 | **Home** | Greeting, tier card (tier, balance, tier-coloured edge), promo card, services |
| 2 | **Telstra Plus hub** | Points band (expiry banner), hero, onboarding checklist / education tiles (new member only), reward picks (**re-ranked in real time from in-session browsing for the new member**), assistant prompts, benefits teaser |
| 3 | **Rewards Store** | Category order (live affinity category moves to the front), "For you" ranking, within-my-points default, search over the real feed |
| 4 | **Reward** | **Points slider** (0 → min(balance, price)) with live "pts + $" split, Points + Pay (Recommended) vs Pay by card (earns 10 pts/$1), "keep earning" goal, complementary recs, illustrative social proof |
| 5 | **Bag** | Per-item points/cash split from the slider, low-point add-ons, confirmation, pending earn, next-goal prompt |
| 6 | **Earn points** | Persona-ordered earning options, interactive card-link, goal progress |
| 7 | **Benefits** | Tier progress and tier-appropriate benefits |
| 8 | **Assistant** | Proactive nudge, starter prompts, scripted replies and free-text intent matching per persona |

## Personas

Exactly two, switchable from the presenter panel (`P`):

- **Alex Nguyen** — new member (11 days), Member tier, 12,400 pts, one mobile, **first visit with no browsing history**. Education-led; generic popularity picks within balance that re-rank live as he browses (product views +2, category taps +1, assistant intents +1); first redemption via the Points + Pay slider.
- **Sarah Mitchell** — Gold member (6 years), family account, 186,500 pts with 22,000 expiring, no redemption in 14 months. Reactivation; family / smart-home rewards fully covered; Gold benefits and partner earning.

## State & data

Local prototype state only (`src/app/DemoContext.tsx`). No real backend, authentication, payment or customer data.

- `src/mock-data/appUsers.ts` — per-persona Telstra Plus experience (home promo, hero, picks, categories, earn options, benefits, why-shown signals).
- `src/mock-data/muse.ts` — assistant prompts, nudges, scripted replies and free-text rules per persona (`replyForIntent`, `replyForText`).
- `src/mock-data/catalogue.json` — 755 in-stock rewards generated from the supplied `telstraplus_enriched_categorized_enriched2.csv` feed (name, brand, image URL on telstra.com.au, points, AUD price, category). `src/mock-data/products.ts` provides lookup, curated per-category "most redeemed" sets used by `affinityPicks()`, and the **demo-only** proportional Points + Pay split (cash = price × share of points not used; 10 pts per $1 earned on the cash part).
- Programme rules (10 pts/$1, tiers, partners, expiry, Points + Pay) follow the supplied Shopping Muse knowledge article and telstra.com.au/plus.

## Presenter mode

Hidden by default. Press `P` (or the **Presenter** button above the phone) to toggle persona switching, persona story card, screen jumper and reset. Tap **Why this?** on a personalised card to open the **Why shown now** reasoning rail. Internal/vendor language stays out of the customer-facing UI except the small "Powered by Dynamic Yield Shopping Muse" tag on the assistant.

## Out of scope (by design)

CDE use cases, and email / SMS / push / Reconnect messaging — these are covered in slides.
