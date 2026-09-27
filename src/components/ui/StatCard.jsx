export function StatCard({ label, value, unit, trendLabel, tone = "neutral" }) {
  const toneColor = {
    neutral: "text-ink-900",
    red: "text-accent-red",
    amber: "text-accent-amber",
    green: "text-accent-green",
  }[tone];

  return (
    <div className="bg-white border border-surface-200 rounded shadow-card p-4 flex flex-col gap-2 min-w-0">
      <span className="text-xs font-medium text-ink-500 uppercase tracking-wide">
        {label}
      </span>
      <div className="flex items-baseline gap-1.5">
        <span className={`text-2xl font-semibold tabular-nums ${toneColor}`}>
          {value}
        </span>
        {unit && <span className="text-sm text-ink-400">{unit}</span>}
      </div>
      {trendLabel && (
        <span className="text-xs text-ink-500">{trendLabel}</span>
      )}
    </div>
  );
}
