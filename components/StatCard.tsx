// KPI card: label + big value + small hint. Used for the 4 dashboard stats.
export default function StatCard({
  label,
  value,
  hint
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="card p-5">
      <p className="label">{label}</p>
      <p className="mt-1 text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">{value}</p>
      <p className="mt-1 text-xs text-ink-500">{hint}</p>
    </div>
  );
}
