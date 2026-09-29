const tones: Record<string, string> = {
  scheduled: "bg-brand-50 text-brand-700 border-brand-100",
  checked_in: "bg-amber-50 text-amber-700 border-amber-200",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-slate-100 text-slate-500 border-slate-200"
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${tones[status] ?? tones.scheduled}`}
    >
      {status.replace("_", " ")}
    </span>
  );
}
