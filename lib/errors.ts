// Structured error reporting. Client boundary posts here; server code calls
// reportError() directly. Entries land in the audit trail + JSON server logs.
// Production: forward to Sentry (one-line change in reportError).
import { audit } from "./audit";
import { count } from "./metrics";

export function reportError(scope: string, err: unknown, extra?: Record<string, string>): string {
  const message = err instanceof Error ? err.message : String(err);
  const id = `ERR-${Date.now().toString(36).toUpperCase()}`;
  console.error(JSON.stringify({ level: "error", id, scope, message, at: new Date().toISOString(), ...extra }));
  try {
    audit({ actor: "system", action: `error:${scope}`, entity: "error", entityId: `${id} ${message.slice(0, 60)}` });
  } catch {
    // audit must never throw inside error handling
  }
  count("errors");
  return id;
}
