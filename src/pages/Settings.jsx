import { useState } from "react";
import { Bell, Building2, Camera, LockKeyhole, MapPinned, Save, ShieldAlert, Users } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { PageHeader } from "../components/ui/PageHeader";
import { useToast } from "../components/ui/Toast";
import { sectors } from "../data/cameras";

const tabs = [
  { label: "General", icon: Building2 }, { label: "Users", icon: Users },
  { label: "Cameras", icon: Camera }, { label: "Zones", icon: MapPinned },
  { label: "Alert Rules", icon: ShieldAlert }, { label: "Notifications", icon: Bell },
  { label: "Security", icon: LockKeyhole },
];
const alertRules = [
  "Restricted Zone Entry",
  "Loitering",
  "Wrong Direction",
  "Camera Offline",
  "Camera Tampering",
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("General");
  const [general, setGeneral] = useState({ station: "Border Operations Centre", timezone: "Asia/Kolkata", language: "English" });
  const [notifications, setNotifications] = useState({ critical: true, elevated: true, cameraHealth: true, dailySummary: false });
  const [security, setSecurity] = useState({ mfa: true, timeout: "15 minutes", audit: true });
  const { showToast } = useToast();
  const [rules, setRules] = useState({
    "Restricted Zone Entry": true,
    Loitering: true,
    "Wrong Direction": true,
    "Camera Offline": true,
    "Camera Tampering": true,
  });

  return (
    <div className="space-y-4">
      <PageHeader title="Settings" subtitle="Local operational preferences and policy controls" action={<Button variant="secondary" size="sm" onClick={() => showToast("Settings saved for this demo session.")}><Save size={13} /> Save changes</Button>} />

      <Card padded={false}>
        <div className="border-b border-slate-200 px-3 py-2">
          <div className="flex flex-wrap gap-1" role="tablist" aria-label="Settings sections">
            {tabs.map(({ label, icon: Icon }) => (
              <button
                key={label}
                onClick={() => setActiveTab(label)}
                role="tab"
                aria-selected={activeTab === label}
                className={`inline-flex items-center gap-1.5 border-b-2 px-3 py-2 text-xs font-medium ${
                  activeTab === label
                    ? "border-blue-600 text-blue-700"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                }`}
              >
                <Icon size={13} /> {label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4">
          {activeTab === "Alert Rules" && (
            <div className="space-y-3">
              {alertRules.map((rule) => (
                <div key={rule} className="flex items-center justify-between rounded border border-slate-200 bg-white p-3">
                  <div>
                    <div className="text-sm font-medium text-slate-900">{rule}</div>
                    <div className="text-xs text-slate-500">Security rule</div>
                  </div>
                  <button
                    onClick={() => setRules((current) => ({ ...current, [rule]: !current[rule] }))}
                    className={`relative h-6 w-11 rounded-full transition ${rules[rule] ? "bg-green-600" : "bg-slate-300"}`}
                    aria-label={rule}
                  >
                    <span
                      className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${rules[rule] ? "left-6" : "left-1"}`}
                    />
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === "General" && <div className="max-w-2xl space-y-4"><SectionIntro title="General preferences" detail="Set the operator console identity and regional defaults." /><Field label="Operations centre name"><input value={general.station} onChange={(event) => setGeneral({ ...general, station: event.target.value })} className={inputClass} /></Field><Field label="Time zone"><select value={general.timezone} onChange={(event) => setGeneral({ ...general, timezone: event.target.value })} className={inputClass}><option value="Asia/Kolkata">India Standard Time (UTC+05:30)</option><option value="UTC">UTC</option></select></Field><Field label="Display language"><select value={general.language} onChange={(event) => setGeneral({ ...general, language: event.target.value })} className={inputClass}><option>English</option><option>Hindi</option></select></Field></div>}

          {activeTab === "Users" && <div className="space-y-4"><SectionIntro title="Operator access" detail="Demo roster and role assignments. User management is local-only." /><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b border-slate-200 text-xs text-slate-500"><th className="px-3 py-2">Operator</th><th className="px-3 py-2">Role</th><th className="px-3 py-2">Access</th></tr></thead><tbody className="divide-y divide-slate-100"><UserRow name="Duty Officer" email="duty.officer@demo.local" role="Administrator" /><UserRow name="R. Verma" email="r.verma@demo.local" role="Field Operator" /><UserRow name="P. Singh" email="p.singh@demo.local" role="Analyst" /></tbody></table></div><Button variant="secondary" size="sm" onClick={() => showToast("Invite flow is simulated in this demo.")}><Users size={13} /> Invite operator</Button></div>}

          {activeTab === "Cameras" && <div className="space-y-4"><SectionIntro title="Camera defaults" detail="Default handling for newly registered camera devices." /><ToggleRow label="Enable stream health monitoring" detail="Flag stale frames and low frame-rate devices" defaultChecked /><ToggleRow label="Use secondary stream for previews" detail="Keep the live wall responsive on constrained links" defaultChecked /><Field label="Default stream protocol"><select className={inputClass} defaultValue="RTSP"><option>RTSP</option><option>WebRTC</option></select></Field></div>}

          {activeTab === "Zones" && <div className="space-y-4"><SectionIntro title="Monitored sectors" detail="Current sector posture from the demo camera inventory." />{sectors.map((sector) => <div key={sector.id} className="flex flex-wrap items-center justify-between gap-3 border border-slate-200 px-3 py-3"><div><div className="text-sm font-medium text-slate-900">{sector.name}</div><div className="text-xs text-slate-500">{sector.id} · {sector.cameras} cameras</div></div><span className={`text-xs font-medium capitalize ${sector.status === "critical" ? "text-red-600" : sector.status === "elevated" ? "text-amber-600" : "text-green-700"}`}>{sector.status}</span></div>)}</div>}

          {activeTab === "Notifications" && <div className="space-y-3"><SectionIntro title="Notification routing" detail="Choose which operational updates appear in the console." /><ToggleRow label="Critical alerts" detail="Immediate in-console notification" checked={notifications.critical} onChange={() => setNotifications({ ...notifications, critical: !notifications.critical })} /><ToggleRow label="Elevated risk alerts" detail="Notify when an elevated event is created" checked={notifications.elevated} onChange={() => setNotifications({ ...notifications, elevated: !notifications.elevated })} /><ToggleRow label="Camera health changes" detail="Notify when a stream degrades or disconnects" checked={notifications.cameraHealth} onChange={() => setNotifications({ ...notifications, cameraHealth: !notifications.cameraHealth })} /><ToggleRow label="Daily operations summary" detail="Include the daily summary in the operator inbox" checked={notifications.dailySummary} onChange={() => setNotifications({ ...notifications, dailySummary: !notifications.dailySummary })} /></div>}

          {activeTab === "Security" && <div className="max-w-2xl space-y-4"><SectionIntro title="Session security" detail="These controls describe the demo policy; no authentication service is connected." /><ToggleRow label="Require multi-factor authentication" detail="Enforce an additional verification step for operator sign-in" checked={security.mfa} onChange={() => setSecurity({ ...security, mfa: !security.mfa })} /><Field label="Automatic session timeout"><select value={security.timeout} onChange={(event) => setSecurity({ ...security, timeout: event.target.value })} className={inputClass}><option>5 minutes</option><option>15 minutes</option><option>30 minutes</option><option>60 minutes</option></select></Field><ToggleRow label="Audit operator actions" detail="Keep an activity record for acknowledgement and escalation" checked={security.audit} onChange={() => setSecurity({ ...security, audit: !security.audit })} /></div>}
        </div>
      </Card>
    </div>
  );
}

const inputClass = "w-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-600";

function SectionIntro({ title, detail }) {
  return <div className="mb-4 border-b border-slate-100 pb-3"><h3 className="text-sm font-semibold text-slate-900">{title}</h3><p className="mt-1 text-xs text-slate-500">{detail}</p></div>;
}

function Field({ label, children }) {
  return <label className="grid grid-cols-1 gap-1.5 text-xs font-medium text-slate-700 sm:grid-cols-[190px_minmax(0,1fr)] sm:items-center"><span>{label}</span>{children}</label>;
}

function ToggleRow({ label, detail, checked: controlled, onChange, defaultChecked = false }) {
  const [localChecked, setLocalChecked] = useState(defaultChecked);
  const isChecked = controlled ?? localChecked;
  return <div className="flex items-center justify-between gap-4 border border-slate-200 px-3 py-3"><div><div className="text-sm font-medium text-slate-900">{label}</div><div className="mt-0.5 text-xs text-slate-500">{detail}</div></div><button type="button" role="switch" aria-checked={isChecked} aria-label={label} onClick={onChange || (() => setLocalChecked(!localChecked))} className={`relative h-6 w-11 shrink-0 rounded-full transition ${isChecked ? "bg-green-600" : "bg-slate-300"}`}><span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${isChecked ? "left-6" : "left-1"}`} /></button></div>;
}

function UserRow({ name, email, role }) {
  return <tr><td className="px-3 py-3"><div className="font-medium text-slate-900">{name}</div><div className="text-xs text-slate-500">{email}</div></td><td className="px-3 py-3 text-slate-700">{role}</td><td className="px-3 py-3"><span className="inline-flex items-center gap-1.5 text-xs text-green-700"><i className="h-1.5 w-1.5 rounded-full bg-green-600" />Active</span></td></tr>;
}
