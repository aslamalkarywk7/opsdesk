import { redirect } from "next/navigation";
import type { Role } from "@/lib/auth-roles";

const styles: Record<Role, string> = {
  ADMIN: "bg-violet-100 text-violet-700 border-violet-200",
  MANAGER: "bg-blue-100 text-blue-700 border-blue-200",
  STAFF: "bg-slate-100 text-slate-600 border-slate-200"
};

const scopes: Record<Role, string> = {
  ADMIN: "Full control: team, audit log, metrics, all appointment actions.",
  MANAGER: "Operations: approve, complete or cancel appointments, stock alerts.",
  STAFF: "Daily tasks: check-in scheduled patients only."
};

export default function RoleBanner({ name, role }: { name: string; role: Role }) {
  return (
    <div className="card flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm">
          Signed in as <span className="font-bold">{name}</span>
        </p>
        <p className="mt-1 text-xs text-slate-500">{scopes[role]}</p>
      </div>
      <span className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-bold ${styles[role]}`}>
        {role}
      </span>
    </div>
  );
}
