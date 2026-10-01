# `lib/designs.ts`

> Data engine for the 65-variant gallery: 8 domains x 8 layouts + 1 signature.

## What it does

- `DOMAINS` (8) x `LAYOUTS` (8) generate ids `d-1..d-64` with palette/nav/chart/density tokens.
- `d-65` is the OpsDesk signature theme; `DESIGN_DOMAINS` feeds the filter.

## Key behavior

- Tokens (palette, nav, chart, density, blurb) drive every preview - theming without markup changes.
- Unit test asserts the count stays 65.

## Screenshot

![all designs](../../public/screenshots/designs/all.png)

## Links

- Source: `../../lib/designs.ts`
- Gallery: [app-showcase-page.md](app-showcase-page.md), [app-showcase-id-page.md](app-showcase-id-page.md)
- Preview: [components-design-preview.md](components-design-preview.md)
- Guide: [DESIGNS](../DESIGNS.md), [DESIGN-SKILLS](../DESIGN-SKILLS.md)
- Index: [FILES](../FILES.md)
