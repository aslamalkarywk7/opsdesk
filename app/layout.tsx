// Root layout: HTML shell + global CSS + shared metadata (title/description).
// All routes render inside {children}. See app/globals.css for .card/.btn.
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OpsDesk - Business Management SaaS",
  description: "Clinics, inventory and orders management. Vercel-native Next.js + TypeScript + Prisma."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
