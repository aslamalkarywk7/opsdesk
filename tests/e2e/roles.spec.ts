import { test, expect } from "@playwright/test";

const PASSWORD = process.env.DEMO_PASSWORD ?? "opsdesk123";

async function login(page, email: string, next = "/dashboard") {
  await page.goto(`/login?next=${next}`);
  await page.getByLabel("Work email").fill(email);
  await page.getByLabel("Password").fill(PASSWORD);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL(`**${next}`, { timeout: 15000 });
  await page.waitForLoadState("networkidle", { timeout: 15000 });
}

test("anon is sent to login", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/login/);
});

test("STAFF sees check-in queue only", async ({ page }) => {
  await login(page, "staff@opsdesk.demo");
  await expect(page.getByRole("heading", { name: "My tasks" })).toBeVisible();
  await expect(page.getByText("Revenue / month")).toHaveCount(0);
  await page.getByPlaceholder("Search patient, doctor, ID...").fill("mona");
  await page.getByRole("button", { name: "Search" }).click();
  await expect(page.getByText("Mona Adel").first()).toBeVisible();
});

test("MANAGER sees approvals and stock", async ({ page }) => {
  await login(page, "manager@opsdesk.demo");
  await expect(page.getByText("Pending approvals").first()).toBeVisible();
  await expect(page.getByText("Low stock alerts")).toBeVisible();
});

test("ADMIN opens team and audit", async ({ page }) => {
  await login(page, "admin@opsdesk.demo");
  await page.goto("/team", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "Team & audit" })).toBeVisible();
  await expect(page.getByText("admin@opsdesk.demo")).toBeVisible();
});

test("STAFF cannot open team", async ({ page }) => {
  await login(page, "staff@opsdesk.demo");
  await page.goto("/team", { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/\/dashboard/);
});
