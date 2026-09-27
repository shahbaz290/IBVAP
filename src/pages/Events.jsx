import { Link } from "react-router-dom";
import { ChevronRight, Filter, Search } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { events, eventRiskMeta, eventStatusMeta } from "../data/events";

export default function EventsPage() {
  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">Events</h1>
          <p className="text-sm text-slate-500">Event history and operator review queue</p>
        </div>
      </div>

      <Card padded={false}>
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 px-4 py-3">
          <div className="flex items-center gap-2 rounded border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-500">
            <Search className="h-3.5 w-3.5" />
            Search
          </div>
          <div className="flex items-center gap-2 rounded border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-500">
            <Filter className="h-3.5 w-3.5" />
            Date
          </div>
          <div className="flex items-center gap-2 rounded border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-500">Event Type</div>
          <div className="flex items-center gap-2 rounded border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-500">Camera</div>
          <div className="flex items-center gap-2 rounded border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-500">Zone</div>
          <div className="flex items-center gap-2 rounded border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-500">Risk Level</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Event ID</th>
                <th className="px-4 py-3 font-medium">Time</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Camera</th>
                <th className="px-4 py-3 font-medium">Entity</th>
                <th className="px-4 py-3 font-medium">Risk</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono text-xs text-slate-700">{event.id}</td>
                  <td className="px-4 py-3 text-slate-600">{formatDateTime(event.time)}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">{event.type}</td>
                  <td className="px-4 py-3 text-slate-700">{event.camera}</td>
                  <td className="px-4 py-3 text-slate-700">{event.entity}</td>
                  <td className="px-4 py-3">
                    <Badge color={eventRiskMeta[event.risk].color}>{event.risk}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge color={eventStatusMeta[event.status].color}>{event.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link to={`/events/${event.id}`} className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700">
                      Open <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function formatDateTime(value) {
  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}
