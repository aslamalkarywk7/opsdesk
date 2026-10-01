/** OpsDesk Tailwind theme: brand/ink tokens + card shadow used by gallery
 *  designs and app pages (see lib/designs.ts + app/globals.css).
 *  @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef4ff",
          100: "#dbe7fe",
          500: "#2b6bff",
          600: "#1f54d6",
          700: "#1a45ad"
        },
        ink: { 500: "#5b6472", 700: "#2b3340", 900: "#111827" }
      },
      boxShadow: { card: "0 1px 2px rgba(16,24,40,.06), 0 8px 24px -12px rgba(16,24,40,.18)" },
      borderRadius: { xl2: "1rem" }
    }
  },
  plugins: []
};
