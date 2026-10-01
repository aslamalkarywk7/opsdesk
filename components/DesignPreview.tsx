// Miniature themed preview for one gallery design: nav + chart + density swatch
// rendered in the design's own tokens (see lib/designs.ts). Gallery-only.
import type { DashboardDesign } from "@/lib/designs";

const BARS = [42, 68, 35, 80, 55, 90, 48, 72];

function Chart({ d }: { d: DashboardDesign }) {
  if (d.chart === "donut") {
    return (
      <div
        className="mx-auto h-14 w-14 rounded-full"
        style={{ background: `conic-gradient(${d.accent} 0 65%, ${d.muted}33 65% 100%)` }}
      >
        <div className="flex h-full w-full items-center justify-center">
          <div className="h-8 w-8 rounded-full" style={{ background: d.surface }} />
        </div>
      </div>
    );
  }
  if (d.chart === "line") {
    return (
      <svg viewBox="0 0 100 32" className="h-10 w-full">
        <polyline points="0,26 15,20 30,22 45,12 60,15 75,6 90,10 100,4" fill="none" stroke={d.accent} strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <div className="flex h-10 items-end gap-1">
      {BARS.map((h, i) => (
        <div key={i} className="flex-1 rounded-sm" style={{ height: `${h}%`, background: i % 3 === 0 ? d.muted : d.accent, opacity: i % 3 === 0 ? 0.45 : 1 }} />
      ))}
    </div>
  );
}

export default function DesignPreview({ d }: { d: DashboardDesign }) {
  const pad = d.density === "airy" ? "p-3 gap-2" : d.density === "compact" ? "p-2 gap-1.5" : "p-1.5 gap-1";
  return (
    <div className="overflow-hidden rounded-xl border" style={{ background: d.bg, borderColor: d.muted + "44" }}>
      <div className="flex items-center gap-1 px-2.5 pt-2">
        <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
        <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        <span className="ml-1 truncate text-[9px] font-semibold" style={{ color: d.muted }}>{d.name}</span>
      </div>
      <div className={`flex ${pad}`}>
        {d.nav === "side" && (
          <div className="flex w-8 flex-col gap-1">
            {[d.accent, d.muted, d.muted, d.muted].map((c, i) => (
              <div key={i} className="h-4 rounded" style={{ background: c, opacity: i === 0 ? 1 : 0.35 }} />
            ))}
          </div>
        )}
        {d.nav === "rail" && (
          <div className="flex w-4 flex-col gap-1">
            {[d.accent, d.muted, d.muted].map((c, i) => (
              <div key={i} className="h-3 w-3 rounded-full" style={{ background: c, opacity: i === 0 ? 1 : 0.35 }} />
            ))}
          </div>
        )}
        <div className="flex-1 space-y-1.5">
          {d.nav === "top" && <div className="h-3 rounded" style={{ background: d.muted, opacity: 0.35 }} />}
          <div className="grid grid-cols-3 gap-1">
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded p-1" style={{ background: d.surface }}>
                <div className="h-1 w-2/3 rounded" style={{ background: d.muted, opacity: 0.5 }} />
                <div className="mt-0.5 h-2 w-1/2 rounded" style={{ background: d.accent }} />
              </div>
            ))}
          </div>
          <div className="rounded p-1.5" style={{ background: d.surface }}>
            <Chart d={d} />
          </div>
          <div className="space-y-0.5">
            {[0.9, 0.7, 0.8].map((w, i) => (
              <div key={i} className="h-1.5 rounded" style={{ width: `${w * 100}%`, background: d.muted, opacity: 0.3 }} />
            ))}
          </div>
        </div>
      </div>
      <div className="px-2.5 pb-2 text-[9px]" style={{ color: d.ink }}>
        <span className="font-bold">{d.domain}</span> <span style={{ color: d.muted }}>- {d.layout} - {d.density}</span>
      </div>
    </div>
  );
}
