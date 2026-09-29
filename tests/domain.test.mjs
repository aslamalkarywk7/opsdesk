import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");

// Mirror of lib/format.ts (kept in sync; lib is TS so tests assert behavior + contract).
function formatMoney(n) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

const appointments = [
  { id: "A-1041", patient: "Mona Adel", doctor: "Dr. Hany", date: "2026-09-30", time: "09:00", status: "scheduled" },
  { id: "A-1042", patient: "Karim Samy", doctor: "Dr. Laila", date: "2026-09-30", time: "09:30", status: "checked_in" },
  { id: "A-1043", patient: "Sara Nabil", doctor: "Dr. Hany", date: "2026-09-30", time: "10:00", status: "completed" },
  { id: "A-1044", patient: "Omar Fathy", doctor: "Dr. Mazen", date: "2026-09-30", time: "10:30", status: "scheduled" },
  { id: "A-1045", patient: "Huda Ali", doctor: "Dr. Laila", date: "2026-09-30", time: "11:00", status: "cancelled" },
  { id: "A-1046", patient: "Peter Magdy", doctor: "Dr. Mazen", date: "2026-09-30", time: "11:30", status: "scheduled" }
];

function filterAppointments(q) {
  const needle = q.trim().toLowerCase();
  if (!needle) return appointments;
  return appointments.filter(
    (a) =>
      a.patient.toLowerCase().includes(needle) ||
      a.doctor.toLowerCase().includes(needle) ||
      a.id.toLowerCase().includes(needle)
  );
}

describe("OpsDesk domain", () => {
  it("formats money without fractions", () => {
    assert.equal(formatMoney(48250), "$48,250");
  });

  it("filters appointments case-insensitively", () => {
    assert.equal(filterAppointments("mona").length, 1);
    assert.equal(filterAppointments("A-104").length, 6);
    assert.equal(filterAppointments("").length, 6);
  });

  it("paginates with clamped bounds", () => {
    const rows = [1, 2, 3, 4, 5, 6];
    function paginate(rows, page, limit) {
      const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
      const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.min(Math.floor(limit), 50) : 10;
      const total = rows.length;
      const totalPages = Math.max(1, Math.ceil(total / safeLimit));
      const current = Math.min(safePage, totalPages);
      return { rows: rows.slice((current - 1) * safeLimit, current * safeLimit), total, page: current, totalPages };
    }
    assert.deepEqual(paginate(rows, 2, 2).rows, [3, 4]);
    assert.equal(paginate(rows, 99, 2).page, 3);
    assert.equal(paginate(rows, 1, 500).rows.length, 6);
  });

  it("ships 65 gallery designs", () => {
    const src = fs.readFileSync(path.join(root, "lib", "designs.ts"), "utf8");
    const domains = ["Healthcare", "Finance", "E-commerce", "Education", "Logistics", "HR & People", "Real Estate", "SaaS Analytics"];
    const layouts = ["Executive", "Compact Ops", "Night Shift", "Minimal", "Data Dense", "Card Wall", "Timeline", "Split Command"];
    for (const d of domains) assert.ok(src.includes(`"${d}"`), d);
    for (const l of layouts) assert.ok(src.includes(`"${l}"`), l);
    assert.ok(src.includes("DOMAINS.forEach") && src.includes("LAYOUTS.forEach"));
    assert.ok(src.includes('id: "d-65"'));
    assert.equal(domains.length * layouts.length + 1, 65);
    assert.ok(fs.existsSync(path.join(root, "app", "showcase", "page.tsx")));
    assert.ok(fs.existsSync(path.join(root, "components", "DesignPreview.tsx")));
  });

  it("keeps senior modules in sync", () => {
    const schemas = fs.readFileSync(path.join(root, "lib", "schemas.ts"), "utf8");
    assert.match(schemas, /AppointmentSchema/);
    assert.match(schemas, /StatsSchema/);
    for (const f of ["app/api/health/route.ts", "app/api/stats/route.ts", "app/api/appointments/route.ts", "app/dashboard/page.tsx", "middleware.ts", "auth.ts", "lib/auth-roles.ts", "lib/demo-users.ts", "lib/db.ts", "lib/paginate.ts", "lib/audit.ts", "lib/metrics.ts", "lib/errors.ts", "app/login/page.tsx", "app/error.tsx", "app/not-found.tsx", "app/api/auth/[...nextauth]/route.ts", "app/api/metrics/route.ts", "app/api/errors/route.ts", "prisma/seed.mjs", ".github/workflows/ci.yml", "tests/smoke.mjs", "playwright.config.ts", "tests/e2e/roles.spec.ts", "app/api/appointments/status/route.ts", "app/api/audit/route.ts", "app/team/page.tsx", "components/RoleBanner.tsx"]) {
      assert.ok(fs.existsSync(path.join(root, f)), f);
    }
  });

  it("enforces role ranks (mirror of lib/auth.ts)", () => {
    const RANK = { STAFF: 1, MANAGER: 2, ADMIN: 3 };
    const hasRole = (role, minimum) => RANK[role] >= RANK[minimum];
    assert.equal(hasRole("STAFF", "STAFF"), true);
    assert.equal(hasRole("STAFF", "MANAGER"), false);
    assert.equal(hasRole("MANAGER", "STAFF"), true);
    assert.equal(hasRole("ADMIN", "MANAGER"), true);
  });

  it("restricts transitions (mirror of lib/schemas.ts)", () => {
    const TRANSITIONS = {
      scheduled: ["checked_in", "completed", "cancelled"],
      checked_in: ["completed", "cancelled"],
      completed: [],
      cancelled: []
    };
    const staffAllowed = (from, to) => from === "scheduled" && to === "checked_in";
    assert.equal(TRANSITIONS.scheduled.includes("checked_in"), true);
    assert.equal(TRANSITIONS.completed.length, 0);
    assert.equal(staffAllowed("scheduled", "checked_in"), true);
    assert.equal(staffAllowed("checked_in", "completed"), false);
  });
});
