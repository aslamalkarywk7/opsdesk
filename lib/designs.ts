// 65 dashboard UI variants: 8 domains x 8 layout systems + 1 signature.
// Data-driven gallery proving range, token discipline and responsive density.
export interface DashboardDesign {
  id: string;
  name: string;
  domain: string;
  layout: string;
  bg: string;
  surface: string;
  accent: string;
  ink: string;
  muted: string;
  nav: "side" | "top" | "rail";
  chart: "bars" | "line" | "donut";
  density: "airy" | "compact" | "dense";
  blurb: string;
}

const DOMAINS = [
  "Healthcare",
  "Finance",
  "E-commerce",
  "Education",
  "Logistics",
  "HR & People",
  "Real Estate",
  "SaaS Analytics"
];

interface LayoutDef {
  layout: string;
  nav: DashboardDesign["nav"];
  chart: DashboardDesign["chart"];
  density: DashboardDesign["density"];
  blurb: string;
}

const LAYOUTS: LayoutDef[] = [
  { layout: "Executive", nav: "side", chart: "bars", density: "airy", blurb: "KPI-first overview for leadership." },
  { layout: "Compact Ops", nav: "rail", chart: "line", density: "compact", blurb: "Dense controls for operators." },
  { layout: "Night Shift", nav: "side", chart: "donut", density: "airy", blurb: "Dark theme for 24/7 teams." },
  { layout: "Minimal", nav: "top", chart: "line", density: "airy", blurb: "Calm single-column focus." },
  { layout: "Data Dense", nav: "side", chart: "bars", density: "dense", blurb: "Tables and filters for analysts." },
  { layout: "Card Wall", nav: "top", chart: "donut", density: "compact", blurb: "Status cards for floor teams." },
  { layout: "Timeline", nav: "rail", chart: "line", density: "compact", blurb: "Schedule-driven daily view." },
  { layout: "Split Command", nav: "side", chart: "bars", density: "dense", blurb: "Monitor + act side by side." }
];

const PALETTES = [
  { bg: "#f6f8fc", surface: "#ffffff", accent: "#2b6bff", ink: "#111827", muted: "#8a94a6" },
  { bg: "#0f172a", surface: "#1e293b", accent: "#38bdf8", ink: "#f1f5f9", muted: "#94a3b8" },
  { bg: "#faf7f2", surface: "#ffffff", accent: "#c2410c", ink: "#1c1917", muted: "#a8a29e" },
  { bg: "#f0fdf4", surface: "#ffffff", accent: "#15803d", ink: "#052e16", muted: "#86a389" },
  { bg: "#fdf2f8", surface: "#ffffff", accent: "#be185d", ink: "#1f1b24", muted: "#a89bb0" },
  { bg: "#1a1b26", surface: "#24273f", accent: "#a78bfa", ink: "#e6e8f2", muted: "#8b90a7" },
  { bg: "#fffbeb", surface: "#ffffff", accent: "#b45309", ink: "#1c1917", muted: "#a39e93" },
  { bg: "#eff6ff", surface: "#ffffff", accent: "#0d9488", ink: "#0b1e2d", muted: "#7d93a5" }
];

export const DESIGNS: DashboardDesign[] = [];

DOMAINS.forEach((domain, d) => {
  LAYOUTS.forEach((l, i) => {
    const p = PALETTES[(d + i) % PALETTES.length];
    DESIGNS.push({
      id: `d-${d * 8 + i + 1}`,
      name: `${domain} ${l.layout}`,
      domain,
      layout: l.layout,
      ...p,
      nav: l.nav,
      chart: l.chart,
      density: l.density,
      blurb: l.blurb
    });
  });
});

DESIGNS.push({
  id: "d-65",
  name: "OpsDesk Signature",
  domain: "SaaS Analytics",
  layout: "Executive",
  bg: "#eef4ff",
  surface: "#ffffff",
  accent: "#1f54d6",
  ink: "#111827",
  muted: "#5b6472",
  nav: "side",
  chart: "bars",
  density: "airy",
  blurb: "The flagship theme used by the live dashboard."
});

export const DESIGN_DOMAINS = ["All", ...DOMAINS];
