# Design & Layout Skills

Proven by the live gallery `/showcase` (65 variants) and the role dashboards. Screenshots: `public/screenshots/designs/`.

## Skills demonstrated

1. **Visual hierarchy** - KPI cards first, details on demand. Executive layout vs Data Dense layout solve opposite attention budgets.
2. **Information density control** - airy / compact / dense tokens adapt the same content to wall screens and old laptops.
3. **Token-driven theming** - palette, nav, chart, density tokens in `lib/designs.ts`. Changing a theme never touches markup - the core design-system skill.
4. **Navigation patterns** - sidebar (desktop depth), rail (operator speed), topbar (mobile-first). Chosen per workflow, not taste.
5. **Data-viz selection** - bars for comparison, line for trend, donut for share. Each layout declares its chart deliberately.
6. **Responsive layout** - sidebar collapses, tables scroll horizontally, grids reflow 3 -> 2 -> 1 columns.
7. **Accessible contrast** - dark and light themes keep accent/muted roles distinct; status never carried by color alone (labels included).
8. **Domain adaptation** - Healthcare (calm, readable), Finance (dense, precise), Night Shift (dark, low glare). Same engine, different language.

## Q&A - why do dashboards need different designs?

**Q: Why not one dashboard for everything?**
A: A floor nurse, a CFO and a night-shift operator look for different answers in under 5 seconds. One layout optimizes for one question; different jobs need different first screens.

**Q: When is dark theme correct?**
A: 24/7 monitoring rooms and low-light wards - reduces glare and eye fatigue. Never for print or bright offices; the gallery keeps both.

**Q: Dense or airy?**
A: Dense for analysts comparing rows; airy for executives scanning KPIs and for touch devices. Density is a user setting, not a designer preference.

**Q: Sidebar, rail or topbar?**
A: Sidebar for deep hierarchies (6+ sections), rail for 3-4 expert tools used all day, topbar for shallow mobile-first products.

**Q: Bars, line or donut?**
A: Bars compare categories, line shows change over time, donut shows parts of a whole. Wrong chart = right data, wrong decision.

**Q: Why do status pills need text, not just color?**
A: 8% of men have color-vision deficiency. Color is decoration; the label carries meaning.

**Q: How do you keep 65 designs consistent?**
A: Tokens. Palette + spacing + radius + chart rules live in one file. Consistency is enforced by construction, not review.

**Q: What would you cut first on a small screen?**
A: Sidebar to topbar, 3-column stats to 1 column, table to horizontally scrolling cards - in that order. Content never removed, only reflowed.

## Gallery map

- `designs/all.png` - all 65 variants, full gallery
- `designs/<domain>.png` - the 8 variants of each domain: healthcare, finance, ecommerce, education, logistics, hr-people, real-estate, saas-analytics
- `showcase-live.png` - one live interactive workspace with search, filter chips, sorting, pagination
