import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { PageHeader } from "../components/ui/PageHeader";
import { Card, CardHeader } from "../components/ui/Card";
import { StatCard } from "../components/ui/StatCard";
import { RiskBadge } from "../components/ui/Badge";
import { StatusDot } from "../components/ui/StatusDot";
import { ChevronRight, ShieldAlert, Activity, Camera, Clock3 } from "lucide-react";
import { alerts, riskLevelMeta } from "../data/alerts";
import { kpis, alertsOverTime, sectorRisk } from "../data/dashboardStats";
import { sectors } from "../data/cameras";

const CHART_AXIS = { fontSize: 11, fill: "#7B8694" };

export default function Dashboard() {
  const recent = alerts.slice(0, 5);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Dashboard"
        subtitle="Border Surveillance Overview"
        action={
          <div className="flex items-center gap-2 rounded border border-slate-200 bg-white px-2 py-1.5 shadow-sm">
            <button className="rounded bg-slate-900 px-2 py-1 text-[11px] font-medium text-white">Today</button>
            <button className="px-2 py-1 text-[11px] font-medium text-slate-500">Last 24 Hours</button>
          </div>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        <StatCard label="Active Cameras" value="24 / 25" tone="green" />
        <StatCard label="Offline Cameras" value="1" tone="red" />
        <StatCard label="Active Alerts" value="12" tone="amber" />
        <StatCard label="Events Today" value="248" />
        <StatCard label="High Risk Events" value="32" tone="red" />
        <StatCard label="Avg. Response" value="4m 12s" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.7fr)_360px] gap-4">
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">LIVE SURVEILLANCE</h3>
              <p className="text-[11px] text-slate-500">Four camera feeds · border posture active</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded border border-green-200 bg-green-50 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-green-700">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              Operational
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 p-4">
            {["CAM-01", "CAM-02", "CAM-03", "CAM-04"].map((cameraId, index) => {
              const cameraMeta = {
                "CAM-01": { name: "Border Fence - North", danger: false },
                "CAM-02": { name: "Patrol Road", danger: true },
                "CAM-03": { name: "Watch Tower Area", danger: false },
                "CAM-04": { name: "Restricted Zone", danger: true },
              }[cameraId];

              return (
                <div
                  key={cameraId}
                  className="relative overflow-hidden rounded border border-slate-200 bg-slate-950"
                  style={{ height: "160px" }}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.2),transparent_38%),linear-gradient(135deg,#111827,#0f172a_55%,#111827)]" />
                  <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "18px 18px" }} />
                  <div className="absolute inset-x-0 top-0 flex items-center justify-between px-2 py-1.5">
                    <span className="inline-flex items-center gap-1 rounded bg-black/30 px-1.5 py-0.5 text-[9px] font-medium text-white/90">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                      LIVE
                    </span>
                    <span className="text-[10px] font-mono text-slate-200">{cameraId}</span>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/80 to-transparent px-2 py-1.5">
                    <div className="text-left">
                      <div className="text-[10px] text-white/80">{cameraMeta.name}</div>
                      <div className="text-[9px] text-slate-300">1920×1080 · 30 FPS</div>
                    </div>
                    {index === 3 && (
                      <div className="rounded border border-red-400/80 bg-red-500/20 px-1.5 py-0.5 text-[9px] font-medium text-red-100">
                        Restricted
                      </div>
                    )}
                  </div>
                  {cameraId === "CAM-04" && (
                    <>
                      <div className="absolute inset-x-8 bottom-8 h-16 skew-y-3 rounded border border-red-400/70 bg-red-500/10" />
                      <div className="absolute right-6 bottom-8 rounded border border-red-200 bg-red-500/15 px-2 py-1 text-[9px] text-red-100">
                        Person P-1042 91%
                      </div>
                    </>
                  )}
                  {cameraId === "CAM-02" && (
                    <div className="absolute right-5 bottom-9 rounded border border-blue-200 bg-blue-500/10 px-2 py-1 text-[9px] text-blue-100">
                      Vehicle V-021 89%
                    </div>
                  )}
                  {cameraId === "CAM-01" && (
                    <div className="absolute left-5 top-8 rounded border border-amber-200 bg-amber-500/10 px-2 py-1 text-[9px] text-amber-100">
                      Person P-1042 92%
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader title="Threat posture" subtitle="Current operational context" />
            <div className="space-y-4">
              <div className="rounded border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-slate-500">
                  <ShieldAlert className="h-3.5 w-3.5 text-red-600" />
                  High priority
                </div>
                <div className="mt-2 text-2xl font-semibold text-slate-900">85 / 100</div>
                <div className="mt-1 text-xs text-slate-500">Unauthorized entry detected in Restricted Zone B</div>
              </div>

              <div className="space-y-3">
                <MetricRow label="Restricted Zone Entry" value="30" />
                <MetricRow label="Unknown Authorization" value="20" />
                <MetricRow label="Wrong Direction" value="15" />
                <MetricRow label="Loitering" value="10" />
                <MetricRow label="Cross-Camera Continuity" value="10" />
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader title="System status" subtitle="Coverage and posture" />
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-slate-700"><Camera className="h-4 w-4 text-slate-500" /> 24 Cameras Online</div>
                <span className="font-medium text-slate-900">24</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-slate-700"><Activity className="h-4 w-4 text-slate-500" /> 12 Active Alerts</div>
                <span className="font-medium text-slate-900">12</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-slate-700"><Clock3 className="h-4 w-4 text-slate-500" /> Events Today</div>
                <span className="font-medium text-slate-900">248</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2" padded={false}>
          <div className="p-4 pb-0">
            <CardHeader
              title="Recent alerts"
              subtitle="Most recent detections requiring review"
              action={
                <Link
                  to="/alerts"
                  className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
                >
                  View all <ChevronRight size={13} />
                </Link>
              }
            />
          </div>
          <div className="divide-y divide-slate-200">
            {recent.map((a) => (
              <Link
                key={a.id}
                to={`/alerts/${a.id}`}
                className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors"
              >
                <RiskBadge level={a.riskLevel} label={riskLevelMeta[a.riskLevel].label} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-900 truncate">{a.type}</p>
                  <p className="text-xs text-slate-500 truncate">{a.cameraName} · {a.zone}</p>
                </div>
                <span className="text-xs font-mono text-slate-400 tabular-nums shrink-0">{formatTime(a.timestamp)}</span>
                <ChevronRight size={15} className="text-slate-400 shrink-0" />
              </Link>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Sector status" subtitle="Coverage and posture" />
          <div className="space-y-3">
            {sectors.map((s) => (
              <div key={s.id} className="flex items-center justify-between rounded border border-slate-200 bg-slate-50 px-3 py-2">
                <div className="min-w-0">
                  <p className="text-sm text-slate-900 truncate">{s.name}</p>
                  <p className="text-xs text-slate-500">{s.cameras} cameras</p>
                </div>
                <StatusDot status={s.status} label={s.status} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function MetricRow({ label, value }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-[11px] text-slate-600">
        <span>{label}</span>
        <span className="font-mono text-slate-900">+{value}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-red-600" style={{ width: `${value}%` }} />
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
