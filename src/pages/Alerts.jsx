import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, SlidersHorizontal } from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader";
import { Card } from "../components/ui/Card";
import { RiskBadge, Badge } from "../components/ui/Badge";
import { alerts, riskLevelMeta, statusMeta } from "../data/alerts";

const riskFilters = ["ALL", "critical", "elevated", "moderate", "low"];
const statusFilters = ["ALL", "open", "acknowledged", "resolved"];

export default function Alerts() {
  const [risk, setRisk] = useState("ALL");
  const [status, setStatus] = useState("ALL");

  const filtered = useMemo(
    () =>
      alerts.filter(
        (a) =>
          (risk === "ALL" || a.riskLevel === risk) &&
          (status === "ALL" || a.status === status)
      ),
    [risk, status]
  );

  return (
    <div>
      <PageHeader
        title="Alert Queue"
        subtitle={`${filtered.length} of ${alerts.length} alerts shown`}
      />

      <Card padded={false}>
        <div className="flex flex-wrap items-center gap-4 px-4 py-3 border-b border-surface-200">
          <div className="flex items-center gap-1.5 text-xs text-ink-500">
            <SlidersHorizontal size={13} />
            Filter
          </div>
          <FilterGroup label="Risk" options={riskFilters} value={risk} onChange={setRisk} />
          <FilterGroup label="Status" options={statusFilters} value={status} onChange={setStatus} />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-ink-500 border-b border-surface-200">
                <th className="font-medium px-4 py-2.5">Time</th>
                <th className="font-medium px-4 py-2.5">Alert ID</th>
                <th className="font-medium px-4 py-2.5">Type</th>
                <th className="font-medium px-4 py-2.5">Camera / Zone</th>
                <th className="font-medium px-4 py-2.5">Risk</th>
                <th className="font-medium px-4 py-2.5">Score</th>
                <th className="font-medium px-4 py-2.5">Status</th>
                <th className="font-medium px-4 py-2.5">Assigned</th>
                <th className="px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-200">
              {filtered.map((a) => (
                <tr key={a.id} className="hover:bg-surface-50 transition-colors">
                  <td className="px-4 py-2.5 font-mono text-xs text-ink-500 whitespace-nowrap">
                    {formatTime(a.timestamp)}
                  </td>
                  <td className="px-4 py-2.5 font-mono text-xs text-ink-700 whitespace-nowrap">
                    {a.id}
                  </td>
                  <td className="px-4 py-2.5 text-ink-900 font-medium whitespace-nowrap">
                    {a.type}
                  </td>
                  <td className="px-4 py-2.5 text-ink-700">
                    <div className="leading-tight">
                      <p>{a.cameraName}</p>
                      <p className="text-xs text-ink-500">{a.zone}</p>
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <RiskBadge level={a.riskLevel} label={riskLevelMeta[a.riskLevel].label} />
                  </td>
                  <td className="px-4 py-2.5 font-mono text-ink-900 tabular-nums">
                    {a.riskScore}
                  </td>
                  <td className="px-4 py-2.5">
                    <Badge color={statusMeta[a.status].color}>{statusMeta[a.status].label}</Badge>
                  </td>
                  <td className="px-4 py-2.5 text-ink-700 whitespace-nowrap">{a.assignedTo}</td>
                  <td className="px-4 py-2.5 text-right">
                    <Link
                      to={`/alerts/${a.id}`}
                      className="inline-flex items-center gap-0.5 text-xs font-medium text-accent-blue hover:underline whitespace-nowrap"
                    >
                      Details <ChevronRight size={13} />
                    </Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-10 text-center text-sm text-ink-500">
                    No alerts match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function FilterGroup({ label, options, value, onChange }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs text-ink-500">{label}:</span>
      <div className="flex items-center gap-1">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`text-xs px-2 py-1 rounded-sm border transition-colors ${
              value === opt
                ? "bg-navy-900 text-white border-navy-900"
                : "bg-white text-ink-500 border-surface-300 hover:bg-surface-50"
            }`}
          >
            {opt === "ALL" ? "All" : capitalize(opt)}
          </button>
        ))}
      </div>
    </div>
  );
}

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}
function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
