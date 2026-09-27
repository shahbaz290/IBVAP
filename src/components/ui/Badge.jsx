const colorMap = {
  red: "bg-red-50 text-accent-red border-red-200",
  amber: "bg-amber-50 text-accent-amber border-amber-200",
  green: "bg-green-50 text-accent-green border-green-200",
  blue: "bg-blue-50 text-accent-blue border-blue-200",
  gray: "bg-surface-100 text-ink-500 border-surface-300",
};

export function Badge({ color = "gray", children, dot = false, className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm border text-xs font-medium ${colorMap[color]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColor(color)}`} />}
      {children}
    </span>
  );
}

function dotColor(color) {
  const map = {
    red: "bg-accent-red",
    amber: "bg-accent-amber",
    green: "bg-accent-green",
    blue: "bg-accent-blue",
    gray: "bg-ink-400",
  };
  return map[color];
}

export function RiskBadge({ level, label }) {
  const meta = {
    critical: "red",
    elevated: "amber",
    moderate: "blue",
    low: "green",
  };
  return (
    <Badge color={meta[level] || "gray"} dot>
      {label}
    </Badge>
  );
}
