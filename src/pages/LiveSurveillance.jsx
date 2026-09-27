import { useState } from "react";
import { Video, VideoOff, Maximize2, Radio, AlertTriangle, Grid2X2, Map, Layers3, Fullscreen } from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { cameras, sectors } from "../data/cameras";

export default function LiveSurveillance() {
  const [sectorFilter, setSectorFilter] = useState("ALL");
  const [focused, setFocused] = useState(cameras[0]?.id ?? null);

  const filtered = cameras.filter((c) => sectorFilter === "ALL" || c.sector === sectorFilter);
  const displayCameras = filtered.slice(0, 4);
  const focusedCam = cameras.find((c) => c.id === focused) || displayCameras[0];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Live Surveillance"
        subtitle={`${cameras.filter((c) => c.status === "online").length} of ${cameras.length} cameras online`}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <ActionPill icon={Grid2X2} label="Grid View" active />
            <ActionPill icon={Map} label="Map View" />
            <ActionPill icon={Layers3} label="All Cameras" />
            <ActionPill icon={Fullscreen} label="Fullscreen" />
            <select
              value={sectorFilter}
              onChange={(e) => setSectorFilter(e.target.value)}
              className="border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-700 outline-none focus:border-blue-600"
            >
              <option value="ALL">All sectors</option>
              {sectors.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.8fr)_320px] gap-4">
        <div className="grid grid-cols-2 gap-3">
          {displayCameras.map((cam) => (
            <button key={cam.id} onClick={() => setFocused(cam.id)} className="text-left">
              <FeedTile camera={cam} selected={cam.id === focusedCam?.id} />
            </button>
          ))}
        </div>

        <Card>
          <h3 className="mb-3 text-sm font-semibold text-slate-900">Focused feed details</h3>
          {focusedCam ? (
            <dl className="space-y-2.5 text-sm">
              <Row label="Camera ID" value={focusedCam.id} mono />
              <Row label="Name" value={focusedCam.name} />
              <Row label="Location" value={focusedCam.post} />
              <Row label="Sector" value={focusedCam.sector} mono />
              <Row label="Type" value={focusedCam.type} />
              <Row label="Resolution" value={focusedCam.resolution} />
              <Row label="Coordinates" value={`${focusedCam.lat.toFixed(3)}, ${focusedCam.lng.toFixed(3)}`} mono />
              <Row label="Last maintenance" value={focusedCam.lastMaintenance} mono />
              <Row
                label="Status"
                value={<Badge color={statusColor(focusedCam.status)} dot>{capitalize(focusedCam.status)}</Badge>}
              />
            </dl>
          ) : (
            <p className="text-sm text-slate-500">No camera selected.</p>
          )}
        </Card>
      </div>
    </div>
  );
}

function FeedTile({ camera, selected = false }) {
  const isOffline = camera.status === "offline";
  const isDegraded = camera.status === "degraded";

  return (
    <div
      className={`relative overflow-hidden rounded border bg-slate-950 ${
        selected ? "border-blue-600 ring-1 ring-blue-200" : "border-slate-800"
      }`}
      style={{ aspectRatio: "16 / 10" }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        {isOffline ? (
          <div className="flex flex-col items-center gap-2 text-slate-300">
            <VideoOff size={26} strokeWidth={1.5} />
            <span className="text-[11px]">Feed unavailable</span>
          </div>
        ) : (
          <SyntheticFeed camera={camera} />
        )}
      </div>

      <div className="absolute inset-x-0 top-0 flex items-center justify-between px-2 py-1.5 bg-gradient-to-b from-black/60 to-transparent">
        <span className="inline-flex items-center gap-1.5 rounded bg-black/25 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-[0.14em] text-white/90">
          <Radio size={8} className="text-red-500" />
          LIVE
        </span>
        <span className="font-mono text-[10px] text-slate-200">{camera.id}</span>
      </div>

      <div className="absolute left-2 top-7 rounded border border-white/10 bg-black/25 px-1.5 py-1 text-[9px] text-slate-100">
        {camera.name}
      </div>

      <div className="absolute bottom-0 inset-x-0 flex items-center justify-between bg-gradient-to-t from-black/75 to-transparent px-2 py-1.5">
        <div className="text-left">
          <div className="text-[10px] text-white/90">{camera.name}</div>
          <div className="text-[9px] text-slate-300">{camera.resolution} · {camera.status === "online" ? "30 FPS" : "8 FPS"}</div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-slate-200">{camera.id}</span>
          {isDegraded && <AlertTriangle size={10} className="text-amber-300" />}
          {!isOffline && <Maximize2 size={11} className="text-white/70" />}
        </div>
      </div>

      {camera.id === "CAM-04" && (
        <>
          <div className="absolute left-[18%] top-[22%] h-[52%] w-[55%] rounded-[30%] border border-red-500/80 bg-red-500/8" />
          <div className="absolute right-4 bottom-8 rounded border border-red-200 bg-red-500/15 px-2 py-1 text-[9px] text-red-100">Person P-1042 91%</div>
        </>
      )}
      {camera.id === "CAM-02" && (
        <div className="absolute right-4 bottom-8 rounded border border-blue-200 bg-blue-500/10 px-2 py-1 text-[9px] text-blue-100">Vehicle V-021 89%</div>
      )}
      {camera.id === "CAM-01" && (
        <div className="absolute left-4 top-9 rounded border border-amber-200 bg-amber-500/10 px-2 py-1 text-[9px] text-amber-100">Person P-1042 92%</div>
      )}
    </div>
  );
}

function SyntheticFeed({ camera }) {
  const seed = camera.id.charCodeAt(camera.id.length - 1);
  const hue = (seed * 13) % 40;

  return (
    <div
      className="relative h-full w-full opacity-95"
      style={{
        background: `repeating-linear-gradient(${seed % 180}deg, hsl(${210 + hue} 26% 12%), hsl(${210 + hue} 26% 12%) 2px, hsl(${210 + hue} 20% 15%) 3px, hsl(${210 + hue} 20% 15%) 4px)`,
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(14,165,233,0.08),transparent_34%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,transparent_96%,rgba(255,255,255,0.04)_100%)] opacity-80" />
      <div className="absolute inset-0 flex items-center justify-center">
        <Video size={28} className="text-slate-500/60" strokeWidth={1.2} />
      </div>
    </div>
  );
}

function ActionPill({ icon: Icon, label, active = false }) {
  return (
    <button
      className={`inline-flex items-center gap-1.5 rounded border px-2 py-1.5 text-[11px] font-medium ${
        active ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-600"
      }`}
    >
      <Icon size={12} />
      {label}
    </button>
  );
}

function Row({ label, value, mono = false }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-slate-500">{label}</dt>
      <dd className={`text-right text-slate-900 ${mono ? "font-mono text-xs" : ""}`}>{value}</dd>
    </div>
  );
}

function statusColor(status) {
  return { online: "green", offline: "red", degraded: "amber" }[status] || "gray";
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
