# The Burger Spot Style Guide

Design tokens mirror the `:root` variables in `assets/css/style.css`. Keep the two in sync.

## Fonts

Google Fonts, loaded in `index.html` (preconnect + `display=swap`). Icons are an inline SVG sprite at the top of `<body>`, so there is no icon-font or CDN script.

``` html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link
  href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&family=Rubik:wght@400;500;600;700&family=Shadows+Into+Light&display=swap"
  rel="stylesheet">
```

---

## Colors

Rule of thumb: saffron surfaces always carry ink text (9.1:1). Orange used as text on light surfaces must be `--burnt-orange` (5.3:1 or better). White text only on `--cinnabar` or ink.

``` css
--rich-black-fogra-29: hsl(210, 26%, 7%);   /* ink */
--champagne-pink_20: hsla(23, 61%, 86%, 0.2);
--independence_30: hsla(245, 17%, 29%, 0.3);
--gray-x-11-gray: hsl(0, 0%, 73%);
--champagne-pink: hsl(23, 61%, 86%);
--spanish-gray: hsl(0, 0%, 46%);            /* placeholders, 4.6:1 */
--sonic-silver: hsl(0, 0%, 33%);            /* body copy, 7.5:1 */
--deep-saffron: hsl(34, 100%, 56%);         /* brand accent */
--dark-orange: hsl(26, 100%, 56%);
--burnt-orange: hsl(22, 90%, 36%);          /* NEW: accent text on light, 5.7:1 */
--desert-sand: hsl(23, 49%, 85%);
--isabelline: hsl(38, 44%, 96%);            /* warm alt surface */
--gainsboro: hsl(0, 0%, 87%);
--tangerine: hsl(31, 84%, 50%);
--cinnabar: hsl(3, 76%, 42%);               /* ketchup red, white text 6.2:1 */
--black_95: hsla(0, 0%, 0%, 0.95);
--cultured: hsl(0, 0%, 91%);
--white: hsl(0, 0%, 100%);
--black: hsl(0, 0%, 0%);
--onyx: hsl(0, 0%, 27%);
--success: hsl(145, 63%, 24%);
--success-bg: hsl(145, 55%, 94%);
--error: hsl(3, 76%, 40%);
```

## Typography

Fluid sizes (`clamp`) replace the old per-breakpoint overrides.

``` css
--ff-shadows-into-light: 'Shadows Into Light', cursive;   /* hero eyebrow only */
--ff-roboto: 'Roboto', system-ui, -apple-system, 'Segoe UI', sans-serif;
--ff-rubik: 'Rubik', 'Roboto', system-ui, sans-serif;

--fs-hero: clamp(4.2rem, 2.4rem + 6.4vw, 7.6rem);
--fs-1: clamp(3.2rem, 2.4rem + 2.6vw, 4.6rem);
--fs-2: clamp(2.2rem, 1.9rem + 1vw, 2.8rem);
--fs-3: 1.9rem;
--fs-4: 1.5rem;
--fs-5: 1.3rem;

--fw-500: 500;
--fw-600: 600;
--fw-700: 700;
```

## Spacing and shape

``` css
--section-padding: clamp(64px, 6vw + 32px, 120px);
--gutter: 20px;
--radius-1: 10px;   /* buttons, inputs */
--radius-2: 18px;   /* cards */
```

## Shadow

``` css
--shadow-1: 0 2px 8px hsla(0, 0%, 0%, 0.14);
--shadow-2: 0 2px 4px hsla(210, 26%, 7%, 0.06), 0 8px 24px hsla(210, 26%, 7%, 0.08);
--shadow-3: 0 4px 8px hsla(210, 26%, 7%, 0.08), 0 18px 40px hsla(210, 26%, 7%, 0.16);
```

## Transition

``` css
--transition-1: 0.25s ease;
--transition-2: 0.5s ease;
```

All motion (hero float, badge pulse, hover lift, running rider, delivery-rider scroll slide) is disabled under `prefers-reduced-motion: reduce`.

## Focus

``` css
--focus-color: var(--rich-black-fogra-29);   /* swapped to white on dark surfaces */
```

Every `:focus-visible` gets a 3px outline in `--focus-color`.

## Clip path

``` css
--clip-path-1: polygon(0 40%, 100% 0%, 100% 100%, 0 100%);
--clip-path-2: polygon(0 0%, 100% 0%, 100% 100%, 0 100%);
```

## Breakpoints

Mobile first. Layout steps at 520, 550, 768, 992 and 1200px. Checked at 360, 768 and 1280px.
