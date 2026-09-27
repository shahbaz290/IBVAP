const colorMap = {
  online: "bg-accent-green",
  offline: "bg-accent-red",
  degraded: "bg-accent-amber",
  nominal: "bg-accent-green",
  elevated: "bg-accent-amber",
  critical: "bg-accent-red",
};

export function StatusDot({ status, label, showLabel = true }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`w-2 h-2 rounded-full ${colorMap[status] || "bg-ink-400"}`} />
      {showLabel && <span className="text-xs text-ink-500 capitalize">{label || status}</span>}
    </span>
  );
}
