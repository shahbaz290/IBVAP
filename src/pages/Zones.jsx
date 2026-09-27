import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { zones } from "../data/zones";

export default function ZonesPage() {
  const zoneConfig = zones[0];

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-lg font-semibold text-slate-900">Zone Configuration</h1>
        <p className="text-sm text-slate-500">Restricted zone policy and camera configuration</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-4">
        <Card className="p-0 overflow-hidden">
          <div className="relative h-[420px] bg-[linear-gradient(135deg,#eaf0f6,#f3f6f9)]">
            <div className="absolute inset-0 opacity-80" style={{ backgroundImage: "linear-gradient(rgba(148,163,184,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.12) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
            <div className="absolute left-[18%] top-[18%] h-[40%] w-[42%] rounded-[28%] border-2 border-red-400 bg-red-200/15" />
            <div className="absolute left-[54%] top-[44%] h-[26%] w-[30%] rounded-[22%] border border-blue-300 bg-blue-100/15" />
            <div className="absolute left-[30%] top-[35%] h-[12%] w-[14%] border border-slate-400 bg-slate-200/40" />
          </div>
        </Card>

        <Card>
          <div className="space-y-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Camera</p>
              <h3 className="mt-1 text-xl font-semibold text-slate-900">CAM-04</h3>
            </div>

            <div className="rounded border border-slate-200 bg-slate-50 p-3">
              <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Configured zone</div>
              <div className="mt-2 text-lg font-semibold text-slate-900">Restricted Zone B</div>
            </div>

            <div className="space-y-3 text-sm text-slate-700">
              <div className="flex items-center justify-between"><span>Zone Type</span><span className="font-medium text-slate-900">{zoneConfig.type}</span></div>
              <div className="flex items-center justify-between"><span>Allowed Direction</span><span className="font-medium text-slate-900">{zoneConfig.direction}</span></div>
              <div className="flex items-center justify-between"><span>Maximum Dwell</span><span className="font-medium text-slate-900">{zoneConfig.dwell}</span></div>
              <div className="flex items-center justify-between"><span>Alert Severity</span><Badge color="red">{zoneConfig.severity}</Badge></div>
            </div>

            <div className="rounded border border-slate-200 p-3">
              <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Additional policy</div>
              <ul className="mt-2 space-y-2 text-sm text-slate-600">
                <li>• Directional violation triggers risk reassessment</li>
                <li>• Cross-camera continuity included in scoring</li>
                <li>• Dwell threshold is enforced with operator review</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
