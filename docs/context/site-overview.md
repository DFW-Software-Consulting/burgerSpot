# Site overview

The Burger Spot is a demo restaurant site for a fictional Dallas burger place, made by DFW Software Consulting. Plain HTML, CSS and JavaScript: no build step, no dependencies, no backend. See [README.md](../../README.md) and [style-guide.md](../../style-guide.md).

## Layout

- `index.html`: the single page. Icons are an inline SVG sprite at the top of `<body>` (no icon font or CDN script). Fonts come from Google Fonts links in the head.
- `assets/css/style.css`: styles and design tokens in `:root`.
- `assets/js/script.js`: all behaviour.
- `assets/images/`: photos and illustrations. `assets/displayImage/`: the preview screenshot used in the README.
- `.vscode/settings.json`: Live Server port only.

## Behaviour in `assets/js/script.js`

Commented sections, in order: mobile nav, header and back-to-top on scroll, animated delivery rider tied to scroll (`[data-delivery-boy]`), menu filter and search, search overlay, toast notices, demo forms.

- Elements are found through `data-*` attributes (`data-menu-item`, `data-filter`, `data-search-*`, `data-toast`). Keep HTML and script in sync when renaming.
- The menu filter keeps state in `menuState` (`category`, `query`). Search matches only dish name, description and category, using a precomputed `searchText` map, so prices and button labels never match.
- "Order Now" buttons and forms are demos: they validate and show a toast or message, and send nothing.
- Reduced-motion preference is honoured (`reduceMotion`).

## Design tokens

`style-guide.md` documents the `:root` variables and says to keep the two in sync. Contrast rules from it: saffron surfaces carry ink text, orange text on light surfaces must use `--burnt-orange`, white text only on `--cinnabar` or ink. Update both files when changing a colour.

## Running and deploying

- Open `index.html` or run `python3 -m http.server 8000`. All paths are relative so it works under a repository sub-path.
- Published as a static site by GitHub Pages. No CI, lint or tests.

## Conventions and gotchas

- The page is marked `noindex` because the business is fictional. Keep names, addresses, prices and 555-01xx phone numbers fictional.
- The site started from a free third-party template; a past fix removed baked-in third-party brand text from an image (commit 11532c1). Check new images for third-party branding.
- Work goes through pull requests into `main`.
