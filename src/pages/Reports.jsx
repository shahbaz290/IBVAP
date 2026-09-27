import { useState } from "react";
import { FileText, Download, Sparkles, CalendarDays, Database } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { PageHeader } from "../components/ui/PageHeader";
import { useToast } from "../components/ui/Toast";
import { alerts } from "../data/alerts";
import { cameras } from "../data/cameras";

const reportCards = [
  { title: "Incident Report", description: "Alert-level records, risk and assignment" },
  { title: "Camera Health Report", description: "Device status, sector and maintenance date" },
  { title: "Risk Analysis Report", description: "Risk score and classification breakdown" },
  { title: "Daily Security Summary", description: "Operational counts and event status" },
];

export default function ReportsPage() {
  const { showToast } = useToast();
  const [reportPeriod, setReportPeriod] = useState("Last 7 days");
  const [recentReports, setRecentReports] = useState([]);

  const generateReport = (title) => {
    const rows = reportRows(title, reportPeriod);
    const csv = rows.map((row) => row.map(escapeCsv).join(",")).join("\r\n");
    const filename = `${title.toLowerCase().replaceAll(" ", "-")}-${new Date().toISOString().slice(0, 10)}.csv`;
    downloadCsv(filename, csv);
    setRecentReports((current) => [{ filename, title, created: new Date().toLocaleString(), csv }, ...current]);
    showToast(`${title} exported as CSV.`);
  };

  return (
    <div className="space-y-4">
      <PageHeader title="Reports" subtitle="Export operational summaries from local demo data" action={<label className="flex items-center gap-2 border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600"><CalendarDays size={14} /><span className="sr-only">Alert reporting period</span><span>Alert period</span><select value={reportPeriod} onChange={(event) => setReportPeriod(event.target.value)} className="bg-transparent font-medium text-slate-800 outline-none"><option>Today</option><option>Last 7 days</option><option>Last 30 days</option></select></label>} />

      <div className="flex items-center gap-2 border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-800"><Database size={14} /> Exports contain frontend demo records only. No server-side report is created.</div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-5">
        {reportCards.map(({ title, description }) => (
          <Card key={title} className="flex h-full flex-col justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded bg-slate-100 text-slate-600">
                <FileText className="h-4 w-4" />
              </div>
              <div className="text-sm font-medium text-slate-900">{title}</div>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-500">{description}</p>
            <div className="mt-6">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => generateReport(title)}
              >
                <Download size={13} /> Export CSV
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Recent reports</h3>
            <p className="text-xs text-slate-500">Last exported package set</p>
          </div>
          <span className="text-xs text-slate-500">{recentReports.length} generated this session</span>
        </div>

        <div className="space-y-3">
          {recentReports.map((report) => (
            <div key={`${report.filename}-${report.created}`} className="flex flex-wrap items-center justify-between gap-3 rounded border border-slate-200 bg-white px-3 py-2.5">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 shrink-0 text-slate-500" />
                <div><div className="text-sm text-slate-700">{report.filename}</div><div className="text-[11px] text-slate-500">{report.title} · {report.created} · {reportPeriod}</div></div>
              </div>
              <button onClick={() => downloadCsv(report.filename, report.csv)} className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700">
                <Download className="h-3.5 w-3.5" />
                Download
              </button>
            </div>
          ))}
          {recentReports.length === 0 && <div className="flex flex-col items-center gap-2 py-8 text-center"><Sparkles className="h-5 w-5 text-slate-400" /><p className="text-sm text-slate-600">No reports generated in this session</p><p className="text-xs text-slate-500">Choose a report above to export current demo records.</p></div>}
        </div>
      </Card>
    </div>
  );
}

function reportRows(title, reportPeriod) {
  const periodAlerts = alerts.filter((alert) => isWithinPeriod(alert.timestamp, reportPeriod));
  if (title === "Incident Report") return [["Alert ID", "Timestamp", "Type", "Risk", "Score", "Camera", "Zone", "Status", "Assigned"], ...periodAlerts.map((alert) => [alert.id, alert.timestamp, alert.type, alert.riskLevel, alert.riskScore, alert.camera, alert.zone, alert.status, alert.assignedTo])];
  if (title === "Camera Health Report") return [["Camera ID", "Name", "Sector", "Post", "Status", "Type", "Resolution", "Last Maintenance"], ...cameras.map((camera) => [camera.id, camera.name, camera.sector, camera.post, camera.status, camera.type, camera.resolution, camera.lastMaintenance])];
  if (title === "Risk Analysis Report") return [["Alert ID", "Type", "Risk Level", "Risk Score", "Zone"], ...periodAlerts.map((alert) => [alert.id, alert.type, alert.riskLevel, alert.riskScore, alert.zone])];
  const openCount = periodAlerts.filter((alert) => alert.status === "open").length;
  const criticalCount = periodAlerts.filter((alert) => alert.riskLevel === "critical").length;
  return [["Metric", "Value"], ["Report date", new Date().toLocaleDateString()], ["Reporting period", reportPeriod], ["Recorded alerts", periodAlerts.length], ["Open alerts", openCount], ["Critical alerts", criticalCount], ["Registered cameras", cameras.length], ["Online cameras", cameras.filter((camera) => camera.status === "online").length]];
}

function isWithinPeriod(timestamp, period) {
  const eventDate = new Date(timestamp);
  const now = new Date();
  if (period === "Today") return eventDate.toDateString() === now.toDateString();
  const days = period === "Last 7 days" ? 7 : 30;
  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() - days);
  return eventDate >= cutoff && eventDate <= now;
}

function escapeCsv(value) {
  const text = String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

function downloadCsv(filename, content) {
  const blob = new Blob([`\uFEFF${content}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
