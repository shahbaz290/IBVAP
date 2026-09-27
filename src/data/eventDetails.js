// Extended per-event data: risk factor breakdown, behaviour timeline and
// cross-camera evidence chain. Keyed by alert id. Falls back to a generated
// baseline for alerts without bespoke detail (see getEventDetail below).

import { alerts } from "./alerts";

const bespoke = {
  "ALT-20261-0847": {
    summary:
      "Three subjects detected moving in coordinated formation toward the perimeter fence in the Restricted Buffer Zone. Pathing shows deliberate use of terrain cover and a pause-and-scan pattern consistent with evasion of observation posts.",
    evidenceSummary:
      "Tracking continuity between three sectors is high-confidence. The movement pattern aligns with staged approach behaviour and exceeds the alert threshold for immediate response.",
    decisionNote:
      "This is not a routine loitering event. Cross-camera corroboration, terrain masking, and repeated pause behaviour materially increase the likelihood of an active breach attempt.",
    evidenceScore: 91,
    riskFactors: [
      { label: "Detection confidence", value: 96, weight: 0.25, detail: "Multi-frame person detection, thermal + visible fusion" },
      { label: "Zone sensitivity", value: 95, weight: 0.3, detail: "Restricted Buffer Zone — highest sensitivity tier" },
      { label: "Behaviour pattern", value: 90, weight: 0.25, detail: "Coordinated group movement, evasive pathing, low-light timing" },
      { label: "Time-of-day factor", value: 82, weight: 0.1, detail: "02:14 IST — historically low patrol density window" },
      { label: "Cross-camera corroboration", value: 88, weight: 0.1, detail: "Consistent track across 2 additional cameras" },
    ],
    timeline: [
      { time: "02:11:52", label: "First detection", detail: "3 subjects entering frame, CAM-1402, 340m from fence", kind: "detection" },
      { time: "02:12:40", label: "Formation identified", detail: "Subjects group into single-file movement pattern", kind: "behaviour" },
      { time: "02:13:05", label: "Handoff", detail: "Track handed to CAM-1406 as subjects cross field boundary", kind: "handoff" },
      { time: "02:13:47", label: "Pause-and-scan detected", detail: "Group halts twice near tree line, consistent with observation avoidance", kind: "behaviour" },
      { time: "02:14:08", label: "Risk threshold crossed", detail: "Composite risk score reaches 92 — critical alert generated", kind: "alert" },
      { time: "02:14:22", label: "Nearest patrol notified", detail: "Alert routed to Forward Post Foxtrot QRT", kind: "action" },
    ],
    crossCamera: [
      { camera: "CAM-1402", cameraName: "Watch Tower 2", role: "Initial detection", confidence: 96, span: "02:11:52 – 02:13:05", impact: "Primary lead" },
      { camera: "CAM-1406", cameraName: "Watch Tower 6", role: "Continuity track", confidence: 91, span: "02:13:05 – 02:14:08", impact: "Track corroboration" },
      { camera: "CAM-1411", cameraName: "Fence Line 11", role: "Corroborating motion (offline, last frame cached)", confidence: 74, span: "02:13:58 – 02:14:02", impact: "Secondary confirmation" },
    ],
    recommendedAction:
      "Dispatch nearest QRT to Forward Post Foxtrot sector; maintain PTZ lock on CAM-1406 track; flag for review regardless of outcome.",
  },
  "ALT-20261-0846": {
    summary:
      "Single subject maintains prolonged static contact with the perimeter fence structure, consistent with a probing or cutting attempt. No tool visible in current frame resolution.",
    evidenceSummary:
      "Evidence quality remains moderate because the event is isolated to one camera, but the duration and fence proximity make the threat credible.",
    decisionNote:
      "Field confirmation is recommended before escalation beyond a patrol dispatch, since there is no adjacent corroboration at the moment of detection.",
    evidenceScore: 68,
    riskFactors: [
      { label: "Detection confidence", value: 89, weight: 0.25, detail: "Single-frame confirmed, IR contrast strong" },
      { label: "Zone sensitivity", value: 85, weight: 0.3, detail: "Perimeter Fence — high sensitivity tier" },
      { label: "Behaviour pattern", value: 80, weight: 0.25, detail: "Static contact exceeding 90s threshold" },
      { label: "Time-of-day factor", value: 70, weight: 0.1, detail: "01:58 IST — reduced patrol density" },
      { label: "Cross-camera corroboration", value: 40, weight: 0.1, detail: "Single-camera detection, no adjacent coverage" },
    ],
    timeline: [
      { time: "01:57:10", label: "First detection", detail: "Subject approaches fence line, CAM-0721", kind: "detection" },
      { time: "01:58:02", label: "Static contact begins", detail: "Subject remains in fixed position against fence", kind: "behaviour" },
      { time: "01:58:41", label: "Risk threshold crossed", detail: "Composite risk score reaches 81 — critical alert generated", kind: "alert" },
      { time: "02:01:15", label: "Acknowledged", detail: "Constable R. Verma acknowledged alert from ops console", kind: "action" },
    ],
    crossCamera: [
      { camera: "CAM-0721", cameraName: "Levee Crossing 3", role: "Sole detection", confidence: 89, span: "01:57:10 – 01:58:41", impact: "Only source camera" },
    ],
    recommendedAction:
      "Direct nearest foot patrol to Forward Post Delta fence segment 3 for visual confirmation.",
  },
};

function synthesizeDetail(alert) {
  return {
    summary: `${alert.type} detected at ${alert.cameraName} (${alert.camera}) in ${alert.zone}. ${alert.behaviour}.`,
    evidenceSummary:
      "Single-source detection with limited corroboration. Operational review is recommended to validate whether additional movement exists before dispatching a larger response.",
    decisionNote:
      "This event meets baseline behavioural thresholds but remains dependent on contextual review because corroborating cameras are not available in the current chain.",
    evidenceScore: Math.min(93, Math.max(52, alert.riskScore - 8)),
    riskFactors: [
      { label: "Detection confidence", value: Math.min(97, alert.riskScore + 6), weight: 0.25, detail: "Model confidence at time of detection" },
      { label: "Zone sensitivity", value: Math.max(20, alert.riskScore - 4), weight: 0.3, detail: `${alert.zone} sensitivity tier` },
      { label: "Behaviour pattern", value: Math.max(15, alert.riskScore - 10), weight: 0.25, detail: alert.behaviour },
      { label: "Time-of-day factor", value: 55, weight: 0.1, detail: "Historical patrol density at time of event" },
      { label: "Cross-camera corroboration", value: alert.subjects > 1 ? 70 : 30, weight: 0.1, detail: "Adjacent camera coverage in range" },
    ],
    timeline: [
      { time: "T+0:00", label: "First detection", detail: `Detected on ${alert.cameraName}`, kind: "detection" },
      { time: "T+0:32", label: "Risk threshold crossed", detail: `Composite risk score reaches ${alert.riskScore}`, kind: "alert" },
      { time: "T+3:10", label: alert.status === "resolved" ? "Resolved" : "Pending review", detail: `Assigned to ${alert.assignedTo}`, kind: "action" },
    ],
    crossCamera: [
      { camera: alert.camera, cameraName: alert.cameraName, role: "Sole detection", confidence: alert.riskScore, span: "—", impact: "Primary evidence source" },
    ],
    recommendedAction: "Route to nearest available patrol unit for visual confirmation.",
  };
}

export function getEventDetail(alertId) {
  const alert = alerts.find((a) => a.id === alertId);
  if (!alert) return null;
  const detail = bespoke[alertId] || synthesizeDetail(alert);
  return { ...alert, ...detail };
}
