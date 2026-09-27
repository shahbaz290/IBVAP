import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Camera, MapPin, Users, Clock, ShieldCheck } from "lucide-react";
import { Card, CardHeader } from "../components/ui/Card";
import { RiskBadge, Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { getEventDetail } from "../data/eventDetails";
import { riskLevelMeta, statusMeta } from "../data/alerts";

export default function EventDetails() {
  const { id } = useParams();
  const event = getEventDetail(id);
  const evidenceScore = event.evidenceScore ?? Math.round((event.riskFactors || []).reduce((total, factor) => total + factor.value, 0) / (event.riskFactors || []).length);

  if (!event) {
    return (
      <div className="max-w-md">
        <p className="text-sm text-ink-500 mb-3">Event {id} could not be found.</p>
        <Link to="/alerts" className="text-sm text-accent-blue hover:underline">
          Back to alert queue
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <Link
        to="/alerts"
        className="inline-flex items-center gap-1 text-xs text-ink-500 hover:text-ink-900 mb-3"
      >
        <ArrowLeft size={13} /> Back to alert queue
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-lg font-semibold text-ink-900">{event.type}</h1>
            <RiskBadge level={event.riskLevel} label={riskLevelMeta[event.riskLevel].label} />
            <Badge color={statusMeta[event.status].color}>{statusMeta[event.status].label}</Badge>
          </div>
          <p className="text-sm text-ink-500 font-mono">{event.id}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm">Acknowledge</Button>
          <Button variant="danger" size="sm">Escalate to QRT</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetaStat icon={Clock} label="Detected" value={formatDateTime(event.timestamp)} />
        <MetaStat icon={Camera} label="Source camera" value={`${event.cameraName} (${event.camera})`} mono />
        <MetaStat icon={MapPin} label="Zone" value={event.zone} />
        <MetaStat icon={Users} label="Subjects" value={event.subjects} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 space-y-4">
          <Card>
            <CardHeader title="Incident summary" subtitle="Operational context from analytics and behaviour review" />
            <div className="space-y-4">
              <p className="text-sm text-ink-700 leading-relaxed">{event.summary}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="rounded border border-surface-200 bg-surface-50 p-3">
                  <p className="text-[11px] uppercase tracking-[0.12em] text-ink-500">Evidence confidence</p>
                  <div className="mt-2 flex items-end gap-2">
                    <span className="text-3xl font-semibold text-ink-900">{evidenceScore}</span>
                    <span className="pb-1 text-xs text-ink-500">/ 100</span>
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-200">
                    <div className="h-full rounded-full bg-accent-blue" style={{ width: `${evidenceScore}%` }} />
                  </div>
                </div>

                <div className="rounded border border-surface-200 bg-surface-50 p-3">
                  <p className="text-[11px] uppercase tracking-[0.12em] text-ink-500">Assessment note</p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-700">{event.decisionNote || "Additional corroboration is recommended before closing the case."}</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-ink-700 border-l-2 border-accent-blue pl-3">
                {event.evidenceSummary || "Evidence indicates a credible risk pattern, but operator judgement remains important for final response posture."}
              </p>
            </div>
          </Card>

          <Card>
            <CardHeader title="Behaviour timeline" subtitle="Sequenced detection-to-alert chain" />
            <ol className="relative border-l border-surface-300 pl-4 space-y-4 ml-1">
              {event.timeline.map((t, i) => (
                <li key={i} className="relative">
                  <span
                    className={`absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${timelineDot(t.kind)}`}
                  />
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-xs text-ink-500">{t.time}</span>
                    <span className="text-sm font-medium text-ink-900">{t.label}</span>
                  </div>
                  <p className="text-xs text-ink-500 mt-0.5">{t.detail}</p>
                </li>
              ))}
            </ol>
          </Card>

          <Card>
            <CardHeader
              title="Cross-camera evidence chain"
              subtitle="Track continuity across correlated cameras"
            />
            <div className="space-y-2">
              {event.crossCamera.map((c, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-3 border border-surface-200 rounded-sm px-3 py-2.5 bg-surface-50"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-sm bg-navy-950 flex items-center justify-center shrink-0">
                      <Camera size={15} className="text-navy-300" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ink-900 truncate">
                        {c.cameraName}{" "}
                        <span className="font-mono text-xs text-ink-500">({c.camera})</span>
                      </p>
                      <p className="text-xs text-ink-500 truncate">
                        {c.role} · {c.span}
                      </p>
                      <p className="text-[11px] text-ink-600 truncate">
                        {c.impact}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-ink-500">Confidence</p>
                    <p className="text-sm font-mono font-medium text-ink-900">{c.confidence}%</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader title="Risk assessment" subtitle={`Composite score: ${event.riskScore} / 100`} />
            <div className="mb-4 flex items-center justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border-[8px] border-surface-200 bg-surface-50 text-xl font-semibold text-ink-900" style={{ borderTopColor: riskRingColor(event.riskScore), borderRightColor: riskRingColor(event.riskScore), borderBottomColor: riskRingColor(event.riskScore, 0.2) }}>
                {event.riskScore}
              </div>
            </div>
            <div className="space-y-3">
              {event.riskFactors.map((f, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-ink-700">{f.label}</span>
                    <span className="text-xs font-mono text-ink-900">{f.value}</span>
                  </div>
                  <div className="h-1.5 bg-surface-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${barColor(f.value)}`}
                      style={{ width: `${f.value}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-ink-500 mt-1">{f.detail}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader title="Recommended action" />
            <div className="flex gap-2.5">
              <ShieldCheck size={16} className="text-accent-blue shrink-0 mt-0.5" />
              <p className="text-sm text-ink-700 leading-relaxed">{event.recommendedAction}</p>
            </div>
          </Card>

          <Card>
            <CardHeader title="Operator judgement" />
            <p className="text-sm leading-relaxed text-ink-700">
              {event.decisionNote || "The event should be monitored closely and re-evaluated if additional corroborating movement is observed."}
            </p>
          </Card>

          <Card>
            <CardHeader title="Assignment" />
            <div className="flex items-center justify-between text-sm">
              <span className="text-ink-500">Assigned to</span>
              <span className="text-ink-900 font-medium">{event.assignedTo}</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function MetaStat({ icon: Icon, label, value, mono = false }) {
  return (
    <div className="bg-white border border-surface-200 rounded p-3 flex items-start gap-2.5">
      <Icon size={15} className="text-ink-400 mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-xs text-ink-500">{label}</p>
        <p className={`text-sm text-ink-900 truncate ${mono ? "font-mono" : "font-medium"}`}>{value}</p>
      </div>
    </div>
  );
}

function timelineDot(kind) {
  return {
    detection: "bg-accent-blue",
    behaviour: "bg-accent-amber",
    handoff: "bg-ink-400",
    alert: "bg-accent-red",
    action: "bg-accent-green",
  }[kind] || "bg-ink-400";
}

function barColor(value) {
  if (value >= 80) return "bg-accent-red";
  if (value >= 55) return "bg-accent-amber";
  return "bg-accent-blue";
}

function riskRingColor(value, alpha = 1) {
  if (value >= 80) return `rgba(194, 39, 45, ${alpha})`;
  if (value >= 55) return `rgba(181, 115, 11, ${alpha})`;
  return `rgba(33, 92, 201, ${alpha})`;
}

function formatDateTime(iso) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}
