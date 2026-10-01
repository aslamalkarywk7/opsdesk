// Playwright E2E runner: tests/e2e on Chromium only. BASE_URL defaults to local
// dev; CI starts `npm start` then runs smoke + e2e (see .github/workflows/ci.yml).
// Run locally: build + start the server first, then `npm run e2e`.
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  retries: 0,
  reporter: "list",
  use: {
    baseURL: process.env.BASE_URL ?? "http://localhost:3000",
    trace: "off"
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }]
});
