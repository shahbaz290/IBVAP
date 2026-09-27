import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Activity, ShieldAlert, Camera, Clock3 } from "lucide-react";
import { Card, CardHeader } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";

const eventsOverTime = [
  { name: "Mon", events: 20 },
  { name: "Tue", events: 31 },
  { name: "Wed", events: 26 },
  { name: "Thu", events: 42 },
  { name: "Fri", events: 38 },
  { name: "Sat", events: 52 },
  { name: "Sun", events: 39 },
];

const riskDistribution = [
  { name: "High", value: 32, color: "#DC2626" },
  { name: "Medium", value: 86, color: "#F59E0B" },
  { name: "Low", value: 130, color: "#2563EB" },
];

const eventTypes = [
  { name: "Unauthorized Entry", value: 40 },
  { name: "Loitering", value: 28 },
  { name: "Vehicle Misuse", value: 19 },
  { name: "Tampering", value: 13 },
];

const cameraActivity = [
  { name: "CAM-01", value: 84 },
  { name: "CAM-02", value: 72 },
  { name: "CAM-03", value: 66 },
  { name: "CAM-04", value: 91 },
  { name: "CAM-05", value: 75 },
  { name: "CAM-06", value: 63 },
];

const topZones = [
  { zone: "Restricted Zone B", score: 92 },
  { zone: "Patrol Road", score: 74 },
  { zone: "Watch Tower Area", score: 68 },
  { zone: "North Fence", score: 58 },
];

export default function AnalyticsPage() {
  const totalEvents = riskDistribution.reduce((sum, item) => sum + item.value, 0);
  return (
    <div className="space-y-4">
      <PageHeader title="Analytics" subtitle="Operational trends · Last 7 days" action={<div className="border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600">Reporting window <span className="ml-1 text-slate-900">7 days</span></div>} />

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <MetricCard icon={Activity} label="Total events" value={totalEvents} note="Across all monitored zones" />
        <MetricCard icon={ShieldAlert} label="High risk" value="32" tone="red" note="13% of reported events" />
        <MetricCard icon={Camera} label="Camera uptime" value="96.8%" tone="green" note="Network-wide availability" />
        <MetricCard icon={Clock3} label="Avg. response" value="4m 12s" tone="blue" note="From alert to acknowledgement" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-4">
        <Card>
          <CardHeader title="Events over time" subtitle="Daily detections · 7-day trend" />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={eventsOverTime} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="eventsFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 3, borderColor: "#E2E8F0" }} />
                <Area type="monotone" dataKey="events" stroke="#2563EB" fill="url(#eventsFill)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title="Risk distribution" subtitle="Severity across recorded events" />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={riskDistribution} dataKey="value" nameKey="name" outerRadius={72} innerRadius={28} paddingAngle={3}>
                  {riskDistribution.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-3">{riskDistribution.map((risk) => <div key={risk.name} className="text-center"><div className="mx-auto mb-1 h-1 w-6 rounded" style={{ backgroundColor: risk.color }} /><div className="text-[10px] text-slate-500">{risk.name}</div><div className="text-sm font-semibold text-slate-900">{risk.value}</div></div>)}</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card>
          <CardHeader title="Event type distribution" subtitle="Share by detection category" />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={eventTypes}>
                <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#64748B" }} interval={0} angle={-12} textAnchor="end" height={54} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 3, borderColor: "#E2E8F0" }} />
                <Bar dataKey="value" radius={[3, 3, 0, 0]} fill="#1F2937" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title="Camera activity" subtitle="Relative detection load by device" />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cameraActivity} layout="vertical">
                <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: "#64748B" }} width={52} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} fill="#2563EB" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-4">
        <Card>
          <CardHeader title="Top Alert Zones" subtitle="Highest risk sectors" />
          <div className="space-y-3">
            {topZones.map((zone) => (
              <div key={zone.zone}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-slate-700">{zone.zone}</span>
                  <span className="font-mono text-slate-900">{zone.score}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-red-600" style={{ width: `${zone.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Camera Health" subtitle="Operational status distribution" />
          <div className="space-y-3 text-sm text-slate-700">
            <div className="flex items-center justify-between"><span>ONLINE</span><span className="font-medium">24</span></div>
            <div className="flex items-center justify-between"><span>OFFLINE</span><span className="font-medium">1</span></div>
            <div className="flex items-center justify-between"><span>LOW FPS</span><span className="font-medium">2</span></div>
            <div className="flex items-center justify-between"><span>STREAM INTERRUPTED</span><span className="font-medium">1</span></div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, tone = "neutral", note }) {
  const toneMap = {
    neutral: "text-slate-900",
    red: "text-red-600",
    amber: "text-amber-600",
    blue: "text-blue-600",
    green: "text-green-700",
  };

  return (
    <div className="border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between"><div className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500">{label}</div><Icon size={15} className="text-slate-400" /></div>
      <div className={`mt-2 text-2xl font-semibold ${toneMap[tone]}`}>{value}</div>
      <div className="mt-1 text-[11px] text-slate-500">{note}</div>
    </div>
  );
}
