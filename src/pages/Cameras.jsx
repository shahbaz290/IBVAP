import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Video, Wrench, Radio, Plus } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { PageHeader } from "../components/ui/PageHeader";
import { useToast } from "../components/ui/Toast";
import { cameras as inventory } from "../data/cameras";

const cameraData = inventory.map((camera) => ({
  id: camera.id,
  name: camera.name,
  location: camera.post,
  status: camera.status.toUpperCase(),
  protocol: "RTSP",
  resolution: camera.resolution,
  fps: camera.status === "offline" ? "0 FPS" : camera.status === "degraded" ? "8 FPS" : "30 FPS",
  lastSeen: camera.status === "offline" ? "No signal" : "Connected",
}));

export default function CamerasPage() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const { showToast } = useToast();
  const filteredCameras = cameraData.filter((camera) =>
    (statusFilter === "ALL" || camera.status === statusFilter) &&
    `${camera.id} ${camera.name} ${camera.location}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <PageHeader title="Camera Inventory" subtitle={`${cameraData.length} registered devices · ${cameraData.filter((camera) => camera.status === "ONLINE").length} online`} action={<Button variant="primary" size="sm" onClick={() => showToast("Camera registration is simulated in this demo.")}><Plus size={14} /> Add Camera</Button>} />

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <InventoryMetric label="Registered" value={cameraData.length} />
        <InventoryMetric label="Online" value={cameraData.filter((camera) => camera.status === "ONLINE").length} tone="green" />
        <InventoryMetric label="Needs attention" value={cameraData.filter((camera) => camera.status !== "ONLINE").length} tone="amber" />
        <InventoryMetric label="Streaming protocol" value="RTSP" />
      </div>

      <Card padded={false}>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
          <div className="relative min-w-[220px] flex-1">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search ID, camera or location" className="w-full border border-slate-200 py-2 pl-8 pr-3 text-sm outline-none focus:border-blue-600" />
          </div>
          <select aria-label="Filter by camera status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"><option value="ALL">All statuses</option><option value="ONLINE">Online</option><option value="DEGRADED">Degraded</option><option value="OFFLINE">Offline</option></select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Camera ID</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Protocol</th>
                <th className="px-4 py-3">Resolution</th>
                <th className="px-4 py-3">FPS</th>
                <th className="px-4 py-3">Last Seen</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredCameras.map((camera) => (
                <tr key={camera.id} className="text-slate-700">
                  <td className="px-4 py-3 font-mono text-xs text-slate-900">{camera.id}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">{camera.name}</td>
                  <td className="px-4 py-3">{camera.location}</td>
                  <td className="px-4 py-3"><StatusForCamera status={camera.status} /></td>
                  <td className="px-4 py-3">{camera.protocol}</td>
                  <td className="px-4 py-3">{camera.resolution}</td>
                  <td className="px-4 py-3">{camera.fps}</td>
                  <td className="px-4 py-3">{camera.lastSeen}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 text-xs text-blue-600">
                      <Link to="/live" className="inline-flex items-center gap-1 hover:text-blue-700"><Video size={12} /> View</Link>
                      <button onClick={() => showToast(`${camera.id} configuration panel is simulated.`)} className="inline-flex items-center gap-1 hover:text-blue-700"><Wrench size={12} /> Configure</button>
                      <button onClick={() => showToast(`${camera.id} stream test completed.`)} className="inline-flex items-center gap-1 hover:text-blue-700"><Radio size={12} /> Test</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCameras.length === 0 && <tr><td colSpan={9} className="px-4 py-10 text-center text-sm text-slate-500">No cameras match these filters.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function InventoryMetric({ label, value, tone = "neutral" }) {
  const color = { neutral: "text-slate-900", green: "text-green-700", amber: "text-amber-700" }[tone];
  return <div className="border border-slate-200 bg-white px-4 py-3"><div className="text-[10px] font-medium uppercase tracking-[0.15em] text-slate-500">{label}</div><div className={`mt-1 text-xl font-semibold ${color}`}>{value}</div></div>;
}

function StatusForCamera({ status }) {
  const map = {
    ONLINE: "green",
    DEGRADED: "amber",
    OFFLINE: "red",
    "LOW FPS": "amber",
    "CAMERA MOVED": "amber",
    "CAMERA OBSTRUCTED": "amber",
  };

  return <Badge color={map[status] || "gray"}>{status}</Badge>;
}
