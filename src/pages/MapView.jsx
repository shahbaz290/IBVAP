import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, ShieldAlert, Route, Radar, Camera, Signal } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { PageHeader } from "../components/ui/PageHeader";
import { cameras, sectors } from "../data/cameras";
import { alerts } from "../data/alerts";

const cameraPositions = [
  { x: 18, y: 28 }, { x: 34, y: 52 }, { x: 44, y: 39 }, { x: 58, y: 66 },
  { x: 67, y: 28 }, { x: 76, y: 49 }, { x: 83, y: 35 }, { x: 88, y: 68 },
];

export default function MapView() {
  const [selectedId, setSelectedId] = useState(cameras[5].id);
  const [sector, setSector] = useState("ALL");
  const visibleCameras = cameras.filter((camera) => sector === "ALL" || camera.sector === sector);
  const selectedCamera = visibleCameras.find((camera) => camera.id === selectedId) || visibleCameras[0];
  const relatedAlert = alerts.find((alert) => alert.camera === selectedCamera?.id && alert.status !== "resolved");

  return (
    <div className="space-y-4">
      <PageHeader title="Map View" subtitle="Border coverage, camera health and active risk corridors" action={<div className="flex items-center gap-2"><select aria-label="Filter cameras by sector" value={sector} onChange={(event) => setSector(event.target.value)} className="border border-surface-300 bg-white px-2.5 py-1.5 text-sm text-ink-700"><option value="ALL">All sectors</option>{sectors.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select><Badge color="blue" dot><Radar size={11} /> Demo data</Badge></div>} />

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_320px] gap-4">
        <Card className="p-0 overflow-hidden">
          <div className="relative h-[540px] overflow-hidden bg-[radial-gradient(circle_at_10%_20%,_rgba(148,163,184,0.18),_transparent_28%),linear-gradient(135deg,#ecf0f4,#dfe7ee_30%,#edf1f5_100%)]">
            <div className="absolute inset-0 opacity-80" style={{ backgroundImage: "linear-gradient(rgba(148,163,184,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.12) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

            <div className="absolute left-[16%] top-[16%] h-[42%] w-[28%] rounded-[40%] border-2 border-red-300 bg-red-200/15" />
            <div className="absolute left-[22%] top-[22%] h-[34%] w-[18%] rounded-[38%] border-2 border-red-400 bg-red-300/10" />

            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M20,22 L56,18 L76,38 L84,82 L48,90 L24,72 Z" fill="rgba(220,38,38,0.10)" stroke="rgba(220,38,38,0.6)" strokeWidth="0.7" />
              <path d="M27,42 Q51,50 70,58" fill="none" stroke="rgba(37,99,235,0.5)" strokeWidth="0.7" strokeDasharray="2 2" />
              <path d="M48,18 Q58,52 74,82" fill="none" stroke="rgba(37,99,235,0.45)" strokeWidth="0.7" strokeDasharray="2 2" />
            </svg>

            {visibleCameras.map((camera) => {
              const position = cameraPositions[cameras.indexOf(camera)];
              const active = camera.id === selectedCamera?.id;
              return <button key={camera.id} onClick={() => setSelectedId(camera.id)} aria-label={`Select ${camera.name}`} className="absolute -translate-x-1/2 -translate-y-1/2 text-left" style={{ left: `${position.x}%`, top: `${position.y}%` }}><span className={`relative flex h-4 w-4 items-center justify-center rounded-full border-2 border-white shadow ${camera.status === "offline" ? "bg-slate-500" : camera.status === "degraded" ? "bg-amber-500" : "bg-blue-600"} ${active ? "ring-4 ring-blue-200" : ""}`}><span className="h-1 w-1 rounded-full bg-white" /></span><span className="mt-1 block whitespace-nowrap rounded bg-white/85 px-1 text-[9px] font-mono font-semibold text-slate-700">{camera.id}</span></button>;
            })}

            <div className="absolute left-[70%] top-[54%] flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded border border-red-200 bg-white px-2 py-1.5 shadow-sm">
              <div className="h-2.5 w-2.5 rounded-full bg-red-600" />
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600">HIGH RISK</div>
                <div className="text-[11px] text-slate-700">CAM-1402 · Restricted Buffer Zone</div>
              </div>
            </div>
            <div className="absolute bottom-3 left-3 flex flex-wrap gap-3 rounded border border-slate-200 bg-white/95 px-3 py-2 text-[10px] text-slate-600 shadow-sm"><span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-blue-600" />Online</span><span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-amber-500" />Degraded</span><span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-slate-500" />Offline</span><span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-red-600" />Active alert</span></div>
          </div>
        </Card>

        <Card>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Selected camera</p>
                <h3 className="mt-1 text-lg font-semibold text-slate-900">{selectedCamera?.name || "No camera"}</h3>
              </div>
              <Badge color={selectedCamera?.status === "online" ? "green" : selectedCamera?.status === "degraded" ? "amber" : "red"} dot>{selectedCamera?.status || "Unavailable"}</Badge>
            </div>

            <div className="space-y-3 text-sm text-slate-700">
              <DetailRow label="Camera ID" value={selectedCamera?.id} />
              <DetailRow label="Sector" value={sectors.find((item) => item.id === selectedCamera?.sector)?.name || selectedCamera?.sector} />
              <DetailRow label="Forward post" value={selectedCamera?.post} />
              <DetailRow label="Sensor" value={`${selectedCamera?.type} · ${selectedCamera?.resolution}`} />
              <DetailRow label="Last maintenance" value={selectedCamera?.lastMaintenance} />
            </div>

            <div className="rounded border border-slate-200 bg-slate-50 p-3">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-900">
                {relatedAlert ? <ShieldAlert className="h-4 w-4 text-red-600" /> : <MapPin className="h-4 w-4 text-blue-600" />}
                {relatedAlert ? "Active alert" : "Camera location"}
              </div>
              <p className="text-xs leading-5 text-slate-600">
                {relatedAlert ? `${relatedAlert.type} · risk ${relatedAlert.riskScore}/100 · ${relatedAlert.zone}` : `Coordinates ${selectedCamera?.lat}, ${selectedCamera?.lng}. No open alert is linked to this camera.`}
              </p>
              {relatedAlert && <Link to={`/alerts/${relatedAlert.id}`} className="mt-2 inline-block text-xs font-medium text-blue-600 hover:underline">Review alert details →</Link>}
            </div>

            <div className="space-y-2 text-xs text-slate-500">
              <div className="flex items-center gap-2"><Route className="h-3.5 w-3.5 text-blue-600" /> Patrol corridor overlay active</div>
              <div className="flex items-center gap-2"><Signal className="h-3.5 w-3.5 text-slate-500" /> {cameras.filter((camera) => camera.status === "online").length} connected · {cameras.filter((camera) => camera.status !== "online").length} require attention</div>
              <Link to="/live" className="inline-flex items-center gap-1 pt-1 font-medium text-blue-600 hover:underline"><Camera className="h-3.5 w-3.5" /> Open live surveillance</Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return <div className="flex items-start justify-between gap-3 border-b border-slate-200 pb-2"><span className="shrink-0 text-slate-500">{label}</span><span className="text-right font-medium text-slate-900">{value || "—"}</span></div>;
}
