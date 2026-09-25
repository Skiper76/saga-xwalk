# Saga xwalk demo

A demo Saga-branded site (UK over-50s brand: Insurance, Holidays, Cruises, Money, Magazine — `https://www.saga.co.uk/`) built on **AEM Edge Delivery Services (EDS)**, authored via **Universal Editor / AEM as a Content Source (xwalk)**. Used as a hands-on demo of AEM CS + Universal Editor + EDS + Content Fragments working together. Rebranded from an earlier NatWest-branded demo (`natwest-xwalk`) — same AEM author tenant, new site path and DAM folder.

## Environments

| Environment | URL |
|---|---|
| Author (edit content here) | https://author-p189773-e1977501.adobeaemcloud.com |
| Preview (previewed content) | https://main--saga-xwalk--skiper76.aem.page/ |
| Live (published content) | https://main--saga-xwalk--skiper76.aem.live/ |
| GitHub repo | https://github.com/Skiper76/saga-xwalk |
| Cloud Manager program | "DEMO POT EMEA Program 6 - Natwest" (shared tenant) |

To edit a page, open it on the **author** host and append `?cmd=open` via the Sidekick, or open the page directly in Universal Editor from AEM Sites.

## Site map

**Real page paths are nested one level under `/index/`** — this is a pre-existing quirk of how the pages were created, not a bug to "fix". Always link internally using these exact paths (never `/content/saga-xwalk/...` — that only works when browsing the raw author host):

| Page | Path |
|---|---|
| Homepage | `/` |
| Insurance | `/index/insurance` |
| Holidays | `/index/holidays` |
| Cruises | `/index/cruises` |
| Cruise cost calculator | `/index/cruises/cost-calculator` |
| Mortgage calculator | `/index/money/mortgage-calculator` |
| Money | `/index/money` |
| Contact us | `/index/contact-us` |
| Magazine | `/index/magazine` |
| Magazine article: "Five simple ways to manage your money better" | `/index/magazine/managing-your-money` |
| Magazine article: "Staying active after 50" | `/index/magazine/staying-active-after-50` |
| Magazine article: "Very hot drinks and cancer risk" | `/index/magazine/hot-drinks-and-cancer-risk` |
| Magazine article: "Daily habits to keep your liver healthy" | `/index/magazine/daily-habits-to-keep-liver-healthy` |
| Magazine article: "How early is too early to wake up?" | `/index/magazine/how-early-is-too-early-to-wake-up` |
| Nav (header content) | `/nav` |
| Footer content | `/footer` |

The cruise cost calculator **widget** (interactive form on the cruise cost calculator page) is a static bundle served from the code repo at `/widgets/cruise-cost-calculator.{html,css,js}` — it is not AEM content, and is referenced by the `widget` block by that exact code path.

## Blocks

| Block | Purpose |
|---|---|
| `hero` / `hero-purple` | Full-width banner, image + heading + CTAs |
| `cards` / `cards-icon` / `cards-account` / `cards-cover` | Card grids, different visual treatments (bordered / icon+link-list / account promo / cover-image) |
| `cf-card` | Renders a Content Fragment (see below) as a styled card or raw JSON |
| `columns` / `columns-feature` | Generic multi-column layout / image+text feature row |
| `carousel-cards` | Horizontally scrollable card carousel |
| `accordion-help` / `accordion-legal` | Expandable FAQ / legal-copy accordions |
| `tabs-tracker` | Tabbed panel (used for the cruise-booking-journey tracker demo) |
| `search-faq` | Client-side search over an index (defaults to `query-index.json`) |
| `table-of-contents` | Auto-built from `<h2>`s in the same section — used on magazine article pages |
| `article-byline` | Author + date row for magazine articles |
| `articles` | Article listing / "related articles" — reads `query-index.json`, filters by path prefix |
| `breadcrumbs` | Auto-derived from the URL's last two path segments, with title lookups via `query-index.json` |
| `quote` | Pull-quote, built client-side (see gotchas — raw `<blockquote>` gets stripped server-side) |
| `ranking-chart` | Ranked percentage bar chart (e.g. the money page's savings-provider satisfaction comparison) |
| `widget` | Embeds a static JS/CSS/HTML bundle from `/widgets/*` by code path |
| `fragment` | Includes another **EDS page's** content by path (page transclusion — not a Content Fragment) |
| `header` / `footer` | Site nav and footer, fed from the `/nav` and `/footer` pages |

Each block's fields are defined in `blocks/<name>/_<name>.json`; running `npm run build:json` merges every block's model/definition/filter into the root `component-*.json` files that Universal Editor actually reads. **Always run this after touching any `_*.json`.**

## Content Fragments

The `cf-card` block's DAM picker is scoped to `/content/dam/saga` (see `blocks/cf-card/_cf-card.json`) and queries a `productCard` GraphQL type via a `"saga"` GraphQL endpoint, following the same pattern as the previous NatWest demo. **The actual Content Fragment Model, fragments, and GraphQL endpoint still need to be created in AEM author under this new site/DAM path** — this is an author-side setup step, out of this repo's scope.

**Known limitation (inherited from the previous demo, still applies once the endpoint exists):** this query only resolves when the visitor has an authenticated AEM session (author host / Universal Editor) — same-origin, credentialed request. Anonymous public delivery on the publish tier is blocked by the dispatcher (no allow-rule for `/content/cq:graphql/*` yet), which needs a `dispatcher.any` change deployed via Cloud Manager. That's outside this repo.

## Experimentation

The [`aem-experimentation`](https://github.com/adobe/aem-experimentation) plugin is vendored under `plugins/experimentation` via `git subtree`. To pull the latest version:
```sh
git subtree pull --squash --prefix plugins/experimentation https://github.com/adobe/aem-experimentation.git v2
```
The Sidekick "Experimentation" button (preview/dev only) opens the simulation panel — see `scripts/experiment-loader.js` for the wiring.

## Brand assets

`styles/brand.css` defines the Saga design tokens (`--saga-navy`, `--saga-teal`, `--saga-coral`, `--saga-lilac`, etc.), approximated from the public saga.co.uk site. No proprietary Saga font files are bundled — `--heading-font-family`/`--body-font-family` use safe web-standard stacks (georgia/arial).

`icons/saga-logo.svg` and `icons/saga-signifer.svg` are the real Saga logo/emblem, pulled from `/content/dam/saga` in AEM (via the AEM Assets API — asset binaries must be downloaded via a presigned blob URL, not the JSON/text API, which mangles non-text binaries). All `drafts/media/*.jpg`/`*.png` product/lifestyle imagery used in the static test pages was pulled the same way from `/content/dam/saga` (38 assets total in that folder — `GET /api/assets/saga.json` lists them all; the experimental `search-assets` skill's `repo:ancestors` term filter did not reliably scope results to that folder, so assets were found by keyword `match` instead).

## Local development

```sh
npm i
npx -y @adobe/aem-cli up --no-open --forward-browser-logs
```
Serves `http://localhost:3000`, proxying real AEM content by default. Static test pages live under `drafts/` — pass `--html-folder drafts --html-mount /` to serve those instead of/alongside live content.

```sh
npm run lint       # eslint + stylelint
npm run lint:fix    # auto-fix
npm run build:json  # regenerate component-definition/models/filters.json from models/_*.json and blocks/*/_*.json
```

## Gotchas (read before you lose an hour to these)

- **`/index/` path prefix** — see Site map above. Never hardcode `/content/saga-xwalk/...` in authored links or block JS; that only resolves on the raw author host, not on the real EDS site.
- **Universal Editor appends `.html`** to internal content-reference links in its canvas. If a block's JS treats a picked reference as a JCR/DAM path (not a page URL), strip a trailing `.html` before using it (see `cf-card.js`).
- **`name` is a reserved property.** AEM uses it for a component's authoring display label (`data-aue-label`). A model field also called `name` will never render as visible content — pick a different field name (e.g. `guestName`, not `name`).
- **Plain `text`-component fields don't render as visible HTML** for generic `block`/`block/item` components (only `richtext`, `reference`, and `aem-content`/`aem-content-fragment` do). When patching content directly via the AEM API, set `modelFields` accordingly (e.g. `"percentage@richtext"`, not `"percentage@text"`) even if the authored model declares a different component type.
- **Content-Fragment picker field:** use `aem-content-fragment` (not `aem-content`, which only browses pages), and nest `rootPath` under `validation` — `{ "validation": { "rootPath": "/content/dam/saga" } }`, not a top-level property.
- **CSS Grid columns going uneven?** Grid items default to `min-width: auto`, so a wide image can force its column past its `1fr` share. Reset `min-width: 0` on the grid's direct children.
- **SVGs without `width`/`height`** (only a `viewBox`) can fail Adobe's `html2md` image validation during preview/publish, blocking the whole page with a 409. If a page won't preview and the error mentions "Images N and M have failed validation," swap those two images for a raster (JPEG/PNG) or a well-formed SVG.
- **Raw `<blockquote>` gets stripped** by the server-side richtext sanitizer (falls back to plain `<p>`). The `quote` block works around this by building the `<blockquote>` client-side from unwrapped content.
- **`query-index.json`** only reflects **published** (not just previewed) pages. If a listing/search block shows nothing, check whether the source pages were actually published (Sidekick "Publish", not AEM's native Publish button — see below).
- **Two different "Publish" buttons.** AEM's own Publish button (in Universal Editor / Sites console) replicates to the classic AEM publish tier — unrelated to EDS. Use the **Sidekick's** Publish button (on the actual `aem.page` URL, not inside the UE canvas) to publish to `aem.live` and refresh `query-index.json`.
