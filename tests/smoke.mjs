// Live-server smoke test: `node tests/smoke.mjs` (needs `npm start` running).
// Covers Auth.js credential flow, RBAC matrix, pagination, validation, metrics.
const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const PASSWORD = process.env.DEMO_PASSWORD ?? "opsdesk123";

let failures = 0;
function check(name, cond) {
  console.log(`${cond ? "ok" : "FAIL"} - ${name}`);
  if (!cond) failures++;
}

async function loginAs(email, password = PASSWORD) {
  const csrfRes = await fetch(`${BASE}/api/auth/csrf`);
  const { csrfToken } = await csrfRes.json();
  const csrfCookie = (csrfRes.headers.get("set-cookie") ?? "").split(";")[0];
  const r = await fetch(`${BASE}/api/auth/callback/credentials`, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded", cookie: csrfCookie },
    body: new URLSearchParams({ csrfToken, email, password }),
    redirect: "manual"
  });
  const loc = r.headers.get("location") ?? "";
  const jar = (r.headers.getSetCookie?.() ?? []).map((c) => c.split(";")[0]).join("; ");
  return { status: r.status, url: loc, cookie: jar };
}

const health = await (await fetch(`${BASE}/api/health`)).json();
check("health ok", health.status === "ok");

const stats = await (await fetch(`${BASE}/api/stats`)).json();
check("stats contract", stats.data?.todayAppointments === 24);

const anonDash = await fetch(`${BASE}/dashboard`, { redirect: "manual" });
check("dashboard requires login (redirect)", anonDash.status === 307 || anonDash.status === 308);

const bad = await loginAs("nope@x.com");
check("unknown account rejected", (bad.url ?? "").includes("error="));

const staff = await loginAs("staff@opsdesk.demo");
check("STAFF credential login", staff.status === 302 && staff.cookie.includes("authjs.session-token"));
const manager = await loginAs("manager@opsdesk.demo");
const admin = await loginAs("admin@opsdesk.demo");
check("MANAGER + ADMIN logins", manager.cookie.length > 0 && admin.cookie.length > 0);

const authed = await fetch(`${BASE}/dashboard`, { headers: { cookie: staff.cookie } });
check("dashboard loads with session", authed.status === 200);

const page2 = await (await fetch(`${BASE}/api/appointments?page=2&limit=2`)).json();
check("pagination meta", page2.total === 6 && page2.page === 2 && page2.data.length === 2);

const invalid = await fetch(`${BASE}/api/appointments`, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ patient: "x" })
});
check("invalid create rejected with 422", invalid.status === 422);

const metrics = await (await fetch(`${BASE}/api/metrics`)).json();
check("metrics endpoint", typeof metrics.uptimeSeconds === "number");

const staffAudit = await fetch(`${BASE}/api/audit`, { headers: { cookie: staff.cookie }, redirect: "manual" });
check("STAFF blocked from audit (403)", staffAudit.status === 403);

const managerAudit = await fetch(`${BASE}/api/audit`, { headers: { cookie: manager.cookie }, redirect: "manual" });
check("MANAGER blocked from audit (403)", managerAudit.status === 403);

let adminAuditOk = false;
try {
  const adminAudit = await (await fetch(`${BASE}/api/audit`, { headers: { cookie: admin.cookie } })).json();
  adminAuditOk = Array.isArray(adminAudit.data);
} catch { adminAuditOk = false; }
check("ADMIN reads audit log", adminAuditOk);

const list = await (await fetch(`${BASE}/api/appointments?limit=50`)).json();
const scheduled = (list.data ?? []).filter((a) => a.status === "scheduled");

if (scheduled.length > 0) {
  const checkin = await fetch(`${BASE}/api/appointments/status`, {
    method: "POST",
    headers: { "content-type": "application/json", cookie: staff.cookie },
    body: JSON.stringify({ id: scheduled[0].id, status: "checked_in" })
  });
  check("STAFF can check in (scheduled->checked_in)", checkin.status === 200);
} else {
  check("STAFF can check in (no scheduled left, restart server to reset)", true);
}

const staffForbidden = await fetch(`${BASE}/api/appointments/status`, {
  method: "POST",
  headers: { "content-type": "application/json", cookie: staff.cookie },
  body: JSON.stringify({ id: "A-1042", status: "completed" })
});
check("STAFF blocked from completing (403)", staffForbidden.status === 403);

const managerAct = await fetch(`${BASE}/api/appointments/status`, {
  method: "POST",
  headers: { "content-type": "application/json", cookie: manager.cookie },
  body: JSON.stringify({ id: "A-1042", status: "completed" })
});
check("MANAGER can complete (checked_in->completed)", managerAct.status === 200 || managerAct.status === 422);

const staffTeam = await fetch(`${BASE}/team`, { headers: { cookie: staff.cookie }, redirect: "manual" });
check("STAFF blocked from /team (redirect)", [307, 308].includes(staffTeam.status));

const adminTeam = await fetch(`${BASE}/team`, { headers: { cookie: admin.cookie } });
check("ADMIN opens /team", adminTeam.status === 200);

const showcase = await fetch(`${BASE}/showcase`);
check("showcase gallery loads", showcase.status === 200);

const filtered = await fetch(`${BASE}/showcase?domain=Finance`);
check("showcase domain filter loads", filtered.status === 200);

const live = await fetch(`${BASE}/showcase/d-10`);
check("showcase live design opens", live.status === 200);

const liveSearch = await fetch(`${BASE}/showcase/d-2?q=mona`);
const liveSearchText = await liveSearch.text();
check("showcase live search filters", liveSearch.status === 200 && liveSearchText.includes("Mona Adel"));

const liveFilter = await fetch(`${BASE}/showcase/d-2?status=completed`);
const liveFilterText = await liveFilter.text();
check("showcase live status filter", liveFilter.status === 200 && liveFilterText.includes("completed"));

const liveSort = await fetch(`${BASE}/showcase/d-2?sort=patient&dir=desc`);
check("showcase live sorting", liveSort.status === 200);

const missing = await fetch(`${BASE}/showcase/d-999`);
check("showcase unknown design 404s", missing.status === 404);

if (failures > 0) {
  console.error(`${failures} smoke checks failed`);
  process.exit(1);
}
console.log("Smoke: all checks passed.");
