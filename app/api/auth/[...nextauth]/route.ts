// Auth.js route handler: exposes GET/POST /api/auth/* (session, CSRF,
// signout, credentials callback). Logic lives in auth.ts; this file only
// re-exports the handlers. See docs/ROLES.md for the login flow.
import { handlers } from "@/auth";

export const { GET, POST } = handlers;
